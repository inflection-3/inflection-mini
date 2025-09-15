import { useState } from "react";
import { useCreateInteractionMutation } from "@/lib/mutations";
import { useQuery } from "@tanstack/react-query";
import { appsQueries } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { createInteractionSchema } from "@mini/types";

export function AddInteractionForm() {
  const [formData, setFormData] = useState<z.infer<typeof createInteractionSchema>>({
    interactionUrl: "",
    verficationType: "none",
    rewardId: "",
    appId: "",
    description: "",
    title: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const createInteractionMutation = useCreateInteractionMutation();
  
  // Get apps list for dropdown
  const { data: apps } = useQuery(appsQueries.listOptions());

  function validateForm(): boolean {
    const result = createInteractionSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<Record<keyof typeof formData, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as keyof typeof formData] = error.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    createInteractionMutation.mutate({ ...formData }, {
      onSuccess: () => {
        setFormData({
          interactionUrl: "",
          verficationType: "none",
          rewardId: "",
          appId: "",
          title: "",
          description: ""
        });
      },
    });
  }

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appId">Partner Application *</Label>
        <select
          id="appId"
          value={formData.appId}
          onChange={(e) => handleChange("appId", e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          aria-invalid={!!errors.appId}
        >
          <option value="">Select an app...</option>
          {apps?.map((app: any) => (
            <option key={app.id} value={app.id}>
              {app.appName}
            </option>
          ))}
        </select>
        {errors.appId && <p className="text-sm text-destructive">{errors.appId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interactionUrl">Interaction URL *</Label>
        <Input
          id="interactionUrl"
          value={formData.interactionUrl}
          onChange={(e) => handleChange("interactionUrl", e.target.value)}
          placeholder="https://app.example.com/action"
          aria-invalid={!!errors.interactionUrl}
        />
        {errors.interactionUrl && <p className="text-sm text-destructive">{errors.interactionUrl}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="verficationType">Verification Type *</Label>
        <select
          id="verficationType"
          value={formData.verficationType}
          onChange={(e) => handleChange("verficationType", e.target.value as any)}
          className="w-full px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          aria-invalid={!!errors.verficationType}
        >
          <option value="none">None</option>
          <option value="auto">Auto</option>
          <option value="api">API</option>
          <option value="manual">Manual</option>
        </select>
        {errors.verficationType && <p className="text-sm text-destructive">{errors.verficationType}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rewardId">Reward ID *</Label>
        <Input
          id="rewardId"
          value={formData.rewardId}
          onChange={(e) => handleChange("rewardId", e.target.value)}
          placeholder="Reward UUID"
          aria-invalid={!!errors.rewardId}
        />
        {errors.rewardId && <p className="text-sm text-destructive">{errors.rewardId}</p>}
        <p className="text-xs text-muted-foreground">
          Enter the UUID of an existing reward. Create rewards first using the Create Reward form.
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createInteractionMutation.isPending}
          className="flex-1"
        >
          {createInteractionMutation.isPending ? "Creating..." : "Add Interaction"}
        </Button>
      </div>
    </form>
  );
}

