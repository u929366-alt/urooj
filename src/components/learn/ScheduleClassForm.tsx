"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/lms/actions";
import { createSessionAction } from "@/lib/lms/liveActions";

/** Default to the next whole hour: nobody schedules a class for 14:37. */
function nextHourLocal(): string {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-secondary-500 px-7 py-3 font-semibold text-white hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Scheduling…" : "Schedule the class"}
    </button>
  );
}

export function ScheduleClassForm({
  courses,
}: {
  courses: Array<{ id: number; title: string }>;
}) {
  const [state, action] = useActionState<FormState, FormData>(createSessionAction, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-primary-900">
          What is the class?
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Week 3 — live Q&A on Excel formulas"
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        {state?.fieldErrors?.title && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="courseId" className="block text-sm font-semibold text-primary-900">
          Which course?
        </label>
        <select
          id="courseId"
          name="courseId"
          defaultValue=""
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-primary-400"
        >
          <option value="">Open to any signed-in student</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Pick a course and only its enrolled students can get in.
        </p>
      </div>

      <input type="hidden" name="tzOffset" defaultValue={String(new Date().getTimezoneOffset())} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startsAt" className="block text-sm font-semibold text-primary-900">
            Starts
          </label>
          {/*
            The time the instructor types is wall-clock time with no zone on
            it. Their browser's offset goes along with it, so the server can
            work out the actual instant rather than reading 7pm in whatever
            zone the hosting happens to be set to.
          */}
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            required
            onChange={(event) => {
              const field = event.currentTarget.form?.elements.namedItem("tzOffset");
              const parsed = new Date(event.currentTarget.value);
              if (field instanceof HTMLInputElement && !Number.isNaN(parsed.getTime())) {
                field.value = String(parsed.getTimezoneOffset());
              }
            }}
            defaultValue={nextHourLocal()}
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          {state?.fieldErrors?.startsAt && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.startsAt}</p>
          )}
        </div>
        <div>
          <label htmlFor="durationMinutes" className="block text-sm font-semibold text-primary-900">
            How long (minutes)
          </label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={5}
            max={480}
            defaultValue={60}
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-primary-900">
          What will you cover? <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <Submit />
    </form>
  );
}
