import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateInteractionMutation } from '@/lib/mutations';
import { rewardQueries } from '@/lib/queries';
import { createInteractionSchema, type Reward } from '@mini/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { z } from "zod";
import { CreateRewardForm } from '@/components/admin/create-reward';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/admin/apps/interaction/$id')({
  component: RouteComponent,
})


function RouteComponent() {
  const { id: appId } = Route.useParams();
  const [isCreateRewardOpen, setIsCreateRewardOpen] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<z.infer<typeof createInteractionSchema>>({
    actionTitle: "",
    title: "",
    description: "",
    interactionUrl: "",
    verificationType: "none",
    rewardId: "",
    appId: appId, 
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const createInteractionMutation = useCreateInteractionMutation();
  
  // Get rewards list for dropdown
  const { data: rewards } = useQuery(rewardQueries.listOptions());

  function validateForm(): boolean {
    const result = createInteractionSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<Record<keyof typeof formData, string>> = {};
      result.error.issues.forEach((error: any) => {
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
          actionTitle: "",
          title: "",
          description: "",
          interactionUrl: "",
          verificationType: "none",
          rewardId: "",
          appId: appId, // Keep app ID from params
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
      {/* App ID is now taken from route params - no selection needed */}
      <div className="space-y-2">
        <Label>Partner Application</Label>
        <div className="px-3 py-2 bg-muted/50 border rounded-md text-sm text-muted-foreground">
          App ID: {appId}
        </div>
        <p className="text-xs text-muted-foreground">
          Creating interaction for this specific app
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="actionTitle">Action Title *</Label>
        <Input
          id="actionTitle"
          value={formData.actionTitle}
          onChange={(e) => handleChange("actionTitle", e.target.value)}
          placeholder="Enter action title"
          aria-invalid={!!errors.actionTitle}
        />
        {errors.actionTitle && <p className="text-sm text-destructive">{errors.actionTitle}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Interaction Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter interaction title"
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
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
        <Label htmlFor="description">Interaction Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter interaction description"
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationType">Verification Type *</Label>
        <Select
          value={formData.verificationType}
          onValueChange={(value) => handleChange("verificationType", value as any)}
        >
          <SelectTrigger className={errors.verificationType ? "border-destructive" : ""}>
            <SelectValue placeholder="Select verification type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
        {errors.verificationType && <p className="text-sm text-destructive">{errors.verificationType}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="rewardId">Reward *</Label>
          <Dialog open={isCreateRewardOpen} onOpenChange={setIsCreateRewardOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                Create New Reward
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Reward</DialogTitle>
              </DialogHeader>
              <CreateRewardForm onClose={() => setIsCreateRewardOpen(false)} appId={appId} />
            </DialogContent>
          </Dialog>
        </div>
        <Select
          value={formData.rewardId}
          onValueChange={(value) => handleChange("rewardId", value)}
        >
          <SelectTrigger className={errors.rewardId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a reward..." />
          </SelectTrigger>
          <SelectContent>
            {rewards?.map((reward: Reward) => (
              <SelectItem key={reward.id} value={reward.id}>
                {reward.title || `${reward.rewardType} Reward`} - {reward.amount} {reward.rewardType === 'points' ? 'pts' : reward.rewardType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.rewardId && <p className="text-sm text-destructive">{errors.rewardId}</p>}
        <p className="text-xs text-muted-foreground">
          Select an existing reward or create a new one using the button above.
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={() => navigate({ to: "/admin/apps/$id", params: { id: appId } })} type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createInteractionMutation.isPending}
          className="flex-1"
        >
          {createInteractionMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Add Interaction"
          )}
        </Button>
      </div>
    </form>
  );
}


