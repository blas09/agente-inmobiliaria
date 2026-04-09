import type { ReactNode } from "react";

interface ProfileWelcomeProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function ProfileWelcome({ title, description, action }: ProfileWelcomeProps) {
  return (
    <div className="bg-lightsecondary relative rounded-lg px-6 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h5 className="card-title">{title}</h5>
          {description ? <p className="text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
