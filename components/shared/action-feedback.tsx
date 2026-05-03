import { cn } from "@/lib/utils";

interface ActionFeedbackProps {
  message: string;
  status?: "idle" | "success" | "error";
  className?: string;
}

export function ActionFeedback({
  message,
  status = "error",
  className,
}: ActionFeedbackProps) {
  const isSuccess = status === "success";

  return (
    <p
      aria-live="polite"
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        isSuccess
          ? "border-success/15 bg-lightsuccess text-success"
          : "border-error/15 bg-lighterror text-error",
        className,
      )}
      role={isSuccess ? "status" : "alert"}
    >
      {message}
    </p>
  );
}
