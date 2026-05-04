import type { ReactNode } from "react";

interface ProfileWelcomeProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function ProfileWelcome({
  title,
  description,
  action,
}: ProfileWelcomeProps) {
  return (
    <div className="bg-lightsecondary relative rounded-lg px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h5 className="card-title break-words">{title}</h5>
          {description ? (
            <p className="text-muted-foreground text-sm sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <div className="w-full shrink-0 sm:w-auto [&_a]:w-full sm:[&_a]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}
