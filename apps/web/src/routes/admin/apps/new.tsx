import { createFileRoute, Link } from '@tanstack/react-router'

import { useState } from "react";
import { useCreateAppMutation } from "@/lib/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { createAppSchema } from "@mini/types";

export const Route = createFileRoute('/admin/apps/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formData, setFormData] = useState<z.infer<typeof createAppSchema>>({
    categoryId: "",
    slug: "",
    appName: "",
    appLogo: "",
    appUrl: "",
    appDescription: "",
    appBadgeLabel: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const createAppMutation = useCreateAppMutation();

  function validateForm(): boolean {
    const result = createAppSchema.safeParse(formData);
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

    createAppMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          categoryId: "",
          slug: "",
          appName: "",
          appLogo: "",
          appUrl: "",
          appDescription: "",
          appBadgeLabel: "",
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
  return   <form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="appName">App Name *</Label>
    <Input
      id="appName"
      value={formData.appName}
      onChange={(e) => handleChange("appName", e.target.value)}
      placeholder="Enter app name"
      aria-invalid={!!errors.appName}
    />
    {errors.appName && <p className="text-sm text-destructive">{errors.appName}</p>}
  </div>

  <div className="space-y-2">
    <Label htmlFor="slug">Slug *</Label>
    <Input
      id="slug"
      value={formData.slug}
      onChange={(e) => handleChange("slug", e.target.value)}
      placeholder="app-slug"
      aria-invalid={!!errors.slug}
    />
    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
  </div>

  <div className="space-y-2">
    <Label htmlFor="categoryId">Category ID *</Label>
    <Input
      id="categoryId"
      value={formData.categoryId}
      onChange={(e) => handleChange("categoryId", e.target.value)}
      placeholder="Category UUID"
      aria-invalid={!!errors.categoryId}
    />
    {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
  </div>

  <div className="space-y-2">
    <Label htmlFor="appLogo">App Logo URL *</Label>
    <Input
      id="appLogo"
      value={formData.appLogo}
      onChange={(e) => handleChange("appLogo", e.target.value)}
      placeholder="https://example.com/logo.png"
      aria-invalid={!!errors.appLogo}
    />
    {errors.appLogo && <p className="text-sm text-destructive">{errors.appLogo}</p>}
  </div>

  <div className="space-y-2">
    <Label htmlFor="appUrl">App URL *</Label>
    <Input
      id="appUrl"
      value={formData.appUrl}
      onChange={(e) => handleChange("appUrl", e.target.value)}
      placeholder="https://app.example.com"
      aria-invalid={!!errors.appUrl}
    />
    {errors.appUrl && <p className="text-sm text-destructive">{errors.appUrl}</p>}
  </div>

  <div className="space-y-2">
    <Label htmlFor="appDescription">App Description *</Label>
    <textarea
      id="appDescription"
      value={formData.appDescription}
      onChange={(e) => handleChange("appDescription", e.target.value)}
      placeholder="Describe your app..."
      className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-vertical focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
      aria-invalid={!!errors.appDescription}
    />
    {errors.appDescription && <p className="text-sm text-destructive">{errors.appDescription}</p>}
  </div>

  <div className="space-y-2">
    <Label htmlFor="appBadgeLabel">Badge Label</Label>
    <Input
      id="appBadgeLabel"
      value={formData.appBadgeLabel}
      onChange={(e) => handleChange("appBadgeLabel", e.target.value)}
      placeholder="Featured, New, etc."
    />
  </div>

  <div className="flex gap-2 pt-4">
    <Link to="/admin" className="flex-1">
    <Button type="button" variant="outline" className="w-full">
      Cancel
    </Button>
    </Link>
    <Button 
      type="submit" 
      disabled={createAppMutation.isPending}
      className="flex-1"
    >
      {createAppMutation.isPending ? "Creating..." : "Create App"}
    </Button>
  </div>
</form>
}
