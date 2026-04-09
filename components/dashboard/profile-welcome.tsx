interface ProfileWelcomeProps {
  title: string;
  description: string;
}

export function ProfileWelcome({ title, description }: ProfileWelcomeProps) {
  return (
    <div className="bg-lightsecondary relative rounded-lg px-6 py-5">
      <div className="flex flex-col gap-0.5">
        <h5 className="card-title">{title}</h5>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
