import { useState, useEffect } from "react";
import { useUpdateInteractionMutation } from "@/lib/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PartnerInteraction } from "@mini/types";

interface EditInteractionFormProps {
  interaction: PartnerInteraction;
}

export function EditInteractionForm({ interaction }: EditInteractionFormProps) {
  const [formData, setFormData] = useState({
    interactionUrl: interaction.interactionUrl,
    verficationType: interaction.verficationType,
    rewardId: interaction.rewardId,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const updateInteractionMutation = useUpdateInteractionMutation();

  useEffect(() => {
    setFormData({
      interactionUrl: interaction.interactionUrl,
      verficationType: interaction.verficationType,
      rewardId: interaction.rewardId,
    });
  }, [interaction]);

  function validateForm(): boolean {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    
    if (!formData.interactionUrl.trim()) {
      newErrors.interactionUrl = "Interaction URL is required";
    } else if (!formData.interactionUrl.startsWith('http')) {
      newErrors.interactionUrl = "Please enter a valid URL";
    }
    
    if (!formData.rewardId.trim()) {
      newErrors.rewardId = "Reward ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    updateInteractionMutation.mutate({
      interactionId: interaction.id,
      ...formData,
    }, {
      onSuccess: () => {
      },
    });
  }

  function handleChange(field: keyof typeof formData, value: string | typeof formData.verficationType) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Enter the UUID of an existing reward.
        </p>
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          <strong>Interaction ID:</strong> {interaction.id}
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>App ID:</strong> {interaction.appId}
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Created:</strong> {new Date(interaction.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={updateInteractionMutation.isPending}
          className="flex-1"
        >
          {updateInteractionMutation.isPending ? "Updating..." : "Update Interaction"}
        </Button>
      </div>
    </form>
  );
}

