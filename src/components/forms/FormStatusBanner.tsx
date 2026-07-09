import { CheckCircle2, AlertCircle } from "lucide-react";

export function FormStatusBanner({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  const isSuccess = status === "success";
  return (
    <div
      role="status"
      className={`mb-5 flex items-start gap-2 rounded-xl p-4 text-sm ${
        isSuccess ? "bg-accent-50 text-accent-700" : "bg-red-50 text-red-700"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
