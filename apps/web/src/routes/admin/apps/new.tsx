import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AppForm } from "@/components/app-form";

export const Route = createFileRoute('/admin/apps/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to admin after successful creation
    navigate({ to: '/admin' });
  };

  const handleCancel = () => {
    navigate({ to: '/admin' });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New App</h1>
          <p className="text-muted-foreground">Add a new partner application to the platform.</p>
        </div>
        <AppForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}
