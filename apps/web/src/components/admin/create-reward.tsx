import { useState } from "react";
import { useCreateRewardMutation } from "@/lib/mutations";
import { useQuery } from "@tanstack/react-query";
import { appsQueries } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { createRewardSchema } from "@mini/types";

export function CreateRewardForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<z.infer<typeof createRewardSchema>>({
    rewardType: "points",
    amount: 0,
    appId: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const createRewardMutation = useCreateRewardMutation();
  
  // Get apps list for dropdown
  const { data: apps } = useQuery(appsQueries.listOptions());

  function validateForm(): boolean {
    const result = createRewardSchema.safeParse(formData);
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

    createRewardMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
        setFormData({
          rewardType: "points",
          amount: 0,
          appId: "",
        });
      },
    });
  }

  function handleChange(field: keyof typeof formData, value: string | number) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  const rewardTypeOptions = [
    { value: "points", label: "Points", description: "Award points to users" },
    { value: "USDC", label: "USDC", description: "Award USDC tokens" },
    { value: "NFT", label: "NFT", description: "Award NFT collectibles" },
  ] as const;

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
        <Label htmlFor="rewardType">Reward Type *</Label>
        <select
          id="rewardType"
          value={formData.rewardType}
          onChange={(e) => handleChange("rewardType", e.target.value as any)}
          className="w-full px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          aria-invalid={!!errors.rewardType}
        >
          {rewardTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.rewardType && <p className="text-sm text-destructive">{errors.rewardType}</p>}
        <p className="text-xs text-muted-foreground">
          {rewardTypeOptions.find(opt => opt.value === formData.rewardType)?.description}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount *
          {formData.rewardType === "points" && " (Points)"}
          {formData.rewardType === "USDC" && " (USDC)"}
          {formData.rewardType === "NFT" && " (Quantity)"}
        </Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step={formData.rewardType === "USDC" ? "0.01" : "1"}
          value={formData.amount}
          onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
          placeholder="Enter amount"
          aria-invalid={!!errors.amount}
        />
        {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
        {formData.rewardType === "USDC" && (
          <p className="text-xs text-muted-foreground">
            Amount in USDC (e.g., 1.50 for $1.50)
          </p>
        )}
        {formData.rewardType === "points" && (
          <p className="text-xs text-muted-foreground">
            Number of points to award
          </p>
        )}
        {formData.rewardType === "NFT" && (
          <p className="text-xs text-muted-foreground">
            Number of NFTs to mint/award
          </p>
        )}
      </div>

      {/* Preview section */}
      <div className="bg-muted/50 p-4 rounded-md space-y-2">
        <h4 className="text-sm font-medium">Reward Preview</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Type:</strong> {formData.rewardType}</p>
          <p><strong>Amount:</strong> {formData.amount}</p>
          <p><strong>App:</strong> {apps?.find((app: any) => app.id === formData.appId)?.appName || "None selected"}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createRewardMutation.isPending}
          className="flex-1"
        >
          {createRewardMutation.isPending ? "Creating..." : "Create Reward"}
        </Button>
      </div>
    </form>
  );
}
