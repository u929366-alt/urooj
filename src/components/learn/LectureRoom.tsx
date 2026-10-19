"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The lecture room.
 *
 * Loads Jitsi's external API from the Hunarsaaz video server and hands it a
 * room name and a token the portal signed. The portal has already decided this
 * person may be here; this component's job is to put them in the call, keep
 * the register honest, and get out of the way when the class ends.
 *
 * Deliberately not an iframe written by hand: the external API gives us the
 * events — joined, left, ended — that attendance and the "class is over"
 * screen depend on.
 */

type JitsiApi = {
  addEventListener: (event: string, handler: (payload?: unknown) => void) => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
  dispose: () => void;
};

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: Record<string, unknown>) => JitsiApi;
  }
}

/** One script tag for the page, however many times this component mounts. */
function loadJitsiScript(domain: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.JitsiMeetExternalAPI) return Promise.resolve();

  const src = `https://${domain}/external_api.js`;
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script failed")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("script failed"));
    document.body.appendChild(script);
  });
}

export function LectureRoom({
  domain,
  roomName,
  token,
  displayName,
  email,
  moderator,
  subject,
  onAttendance,
}: {
  domain: string;
  roomName: string;
  token: string | null;
  displayName: string;
  email?: string | null;
  moderator: boolean;
  subject: string;
  onAttendance: (roomName: string, minutesPresent: number) => Promise<{ ok: boolean }>;
}) {
  const container = useRef<HTMLDivElement>(null);
  const api = useRef<JitsiApi | null>(null);
  const joinedAt = useRef<number | null>(null);
  const router = useRouter();
  const [state, setState] = useState<"loading" | "joined" | "left" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    loadJitsiScript(domain)
      .then(() => {
        if (cancelled || !container.current || !window.JitsiMeetExternalAPI) return;

        const instance = new window.JitsiMeetExternalAPI(domain, {
          roomName,
          jwt: token ?? undefined,
          parentNode: container.current,
          userInfo: { displayName, email: email ?? undefined },
          configOverwrite: {
            subject,
            prejoinPageEnabled: true,
            disableDeepLinking: true,
            // A hundred people arriving with microphones open is a hundred
            // open microphones. Students raise a hand to speak; the
            // instructor, who is moderator, is not muted by this.
            startWithAudioMuted: !moderator,
            startWithVideoMuted: !moderator,
            // Only a handful of video streams are forwarded at once whatever
            // the class size. This is the setting that makes a large lecture
            // survivable on one server.
            channelLastN: 4,
            enableLayerSuspension: true,
            disableTileView: false,
            toolbarButtons: moderator
              ? [
                  "microphone", "camera", "desktop", "chat", "raisehand",
                  "participants-pane", "tileview", "settings", "recording",
                  "mute-everyone", "security", "hangup",
                ]
              : ["microphone", "camera", "chat", "raisehand", "tileview", "settings", "hangup"],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            DEFAULT_BACKGROUND: "#0b2545",
            MOBILE_APP_PROMO: false,
            DISABLE_VIDEO_BACKGROUND: true,
          },
        });

        api.current = instance;

        instance.addEventListener("videoConferenceJoined", () => {
          joinedAt.current = Date.now();
          setState("joined");
          // Recorded once, on arrival, so the register shows who turned up
          // even if the browser later dies without saying goodbye.
          void onAttendance(roomName, 0);
        });

        instance.addEventListener("videoConferenceLeft", () => {
          setState("left");
          const minutes = joinedAt.current
            ? Math.round((Date.now() - joinedAt.current) / 60_000)
            : 0;
          void onAttendance(roomName, minutes).then(() => router.refresh());
        });

        instance.addEventListener("readyToClose", () => setState("left"));
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      api.current?.dispose();
      api.current = null;
    };
  }, [domain, roomName, token, displayName, email, moderator, subject, onAttendance, router]);

  // A heartbeat, so a class someone sat through for an hour is not recorded as
  // nought minutes because their laptop lid closed before the leave event.
  useEffect(() => {
    if (state !== "joined") return;
    const timer = setInterval(() => {
      if (!joinedAt.current) return;
      const minutes = Math.round((Date.now() - joinedAt.current) / 60_000);
      void onAttendance(roomName, minutes);
    }, 300_000);
    return () => clearInterval(timer);
  }, [state, roomName, onAttendance]);

  if (state === "error") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">The video server did not answer.</p>
        <p className="mt-2">
          The class may still be going. Refresh the page, and if it keeps failing tell your
          instructor — it is the video server at <code>{domain}</code>, not your connection.
        </p>
      </div>
    );
  }

  return (
    <div>
      {state === "left" && (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700">
          <p className="font-semibold text-primary-900">You have left the class.</p>
          <p className="mt-1">
            Your attendance is recorded. Refresh the page to go back in while it is still running.
          </p>
        </div>
      )}
      <div
        ref={container}
        className="h-[70vh] min-h-[420px] w-full overflow-hidden rounded-2xl bg-primary-900"
      />
      {state === "loading" && (
        <p className="mt-3 text-center text-sm text-gray-500">Connecting to the classroom…</p>
      )}
    </div>
  );
}
