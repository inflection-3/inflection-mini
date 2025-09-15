import { useState } from "react";
import { useCreateRewardMutation } from "@/lib/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { createRewardSchema } from "@mini/types";

interface CreateRewardFormProps {
  onClose: () => void;
  appId: string;
}

export function CreateRewardForm({ onClose, appId }: CreateRewardFormProps) {
  const [formData, setFormData] = useState<z.infer<typeof createRewardSchema>>({
    rewardType: "points",
    amount: 0,
    appId: appId, // Use the provided appId
    title: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const createRewardMutation = useCreateRewardMutation();

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
          title: "",
          rewardType: "points",
          amount: 0,
          appId: appId, // Keep the provided appId
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
    <form onSubmit={(e) => {
      e.preventDefault();
    }} className="space-y-4">
      <div className="space-y-2">
        <Label>Partner Application</Label>
        <div className="px-3 py-2 bg-muted/50 border rounded-md text-sm text-muted-foreground">
          App ID: {appId}
        </div>
        <p className="text-xs text-muted-foreground">
          Creating reward for this specific app
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Reward Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter reward title"
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rewardType">Reward Type *</Label>
        <Select
          value={formData.rewardType}
          onValueChange={(value) => handleChange("rewardType", value as any)}
        >
          <SelectTrigger className={errors.rewardType ? "border-destructive" : ""}>
            <SelectValue placeholder="Select reward type..." />
          </SelectTrigger>
          <SelectContent>
            {rewardTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          <p><strong>App ID:</strong> {appId}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit}
          disabled={createRewardMutation.isPending}
          className="flex-1"
        >
          {createRewardMutation.isPending ? "Creating..." : "Create Reward"}
        </Button>
      </div>
    </form>
  );
}
