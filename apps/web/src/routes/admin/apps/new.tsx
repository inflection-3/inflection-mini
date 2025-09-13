import { createFileRoute, Link } from '@tanstack/react-router'

import { useState, useCallback, useMemo } from "react";
import { useCreateAppMutation, useCreateCategoryMutation } from "@/lib/mutations";
import { categoryQueries } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { createAppSchema, createCategorySchema, type Category } from "@mini/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

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
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const createAppMutation = useCreateAppMutation();
  const createCategoryMutation = useCreateCategoryMutation();
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(categoryQueries.listOptions());

  const validateForm = useCallback((): boolean => {
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
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
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
  }, [validateForm, createAppMutation, formData]);

  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Only clear error if it exists to prevent unnecessary state updates
    setErrors(prev => {
      if (prev[field]) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleCreateCategory = useCallback(() => {
    if (!newCategoryName.trim()) {
      setCategoryError("Category name is required");
      return;
    }

    const result = createCategorySchema.safeParse({ name: newCategoryName });
    if (!result.success) {
      setCategoryError("Invalid category name");
      return;
    }

    createCategoryMutation.mutate(
      { name: newCategoryName },
      {
        onSuccess: (category) => {
          setFormData(prev => ({ ...prev, categoryId: category?.id ?? "" }));
          setIsAddCategoryOpen(false);
          setNewCategoryName("");
          setCategoryError("");
        },
        onError: () => {
          setCategoryError("Failed to create category");
        },
      }
    );
  }, [newCategoryName, createCategoryMutation]);

  // Memoize category options to prevent unnecessary Select rerenders
  const categoryOptions = useMemo(() => 
    categories.map((category: Category) => (
      <SelectItem key={category.id} value={category.id}>
        {category.name}
      </SelectItem>
    )), [categories]
  );

  // Memoized handlers for specific fields to prevent recreation
  const handleAppNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("appName", e.target.value);
  }, [handleChange]);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("slug", e.target.value);
  }, [handleChange]);

  const handleCategoryChange = useCallback((value: string) => {
    handleChange("categoryId", value);
  }, [handleChange]);

  const handleAppLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("appLogo", e.target.value);
  }, [handleChange]);

  const handleAppUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("appUrl", e.target.value);
  }, [handleChange]);

  const handleAppDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange("appDescription", e.target.value);
  }, [handleChange]);

  const handleAppBadgeLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("appBadgeLabel", e.target.value);
  }, [handleChange]);

  const handleNewCategoryNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
    setCategoryError("");
  }, []);

  const handleCancelDialog = useCallback(() => {
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
    setCategoryError("");
  }, []);

  return <form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="appName">App Name *</Label>
    <Input
      id="appName"
      value={formData.appName}
      onChange={handleAppNameChange}
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
      onChange={handleSlugChange}
      placeholder="app-slug"
      aria-invalid={!!errors.slug}
    />
    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
  </div>

  <div className="space-y-2">
    <Label htmlFor="categoryId">Category *</Label>
    <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
      <SelectTrigger aria-invalid={!!errors.categoryId}>
        <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
      </SelectTrigger>
      <SelectContent>
        {categoryOptions}
      </SelectContent>
    </Select>
    {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
    
    <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={newCategoryName}
              onChange={handleNewCategoryNameChange}
              placeholder="Enter category name"
              aria-invalid={!!categoryError}
            />
            {categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>

  <div className="space-y-2">
    <Label htmlFor="appLogo">App Logo URL *</Label>
    <Input
      id="appLogo"
      value={formData.appLogo}
      onChange={handleAppLogoChange}
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
      onChange={handleAppUrlChange}
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
      onChange={handleAppDescriptionChange}
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
      onChange={handleAppBadgeLabelChange}
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
