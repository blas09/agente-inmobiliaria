import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { PropertyForm } from "@/features/properties/property-form";
import { createPropertyAction } from "@/features/properties/actions";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <ProfileWelcome title="Nueva propiedad" />
      <PropertyForm action={createPropertyAction} />
    </div>
  );
}
