import { createFileRoute, Link } from '@tanstack/react-router'

import { useState, useCallback, useMemo } from "react";
import { useCreateAppMutation, useCreateCategoryMutation, useUploadMutation } from "@/lib/mutations";
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
import UploadBanner from "@/components/upload-banner";
import UploadAvatar from "@/components/upload-avatar";

export const Route = createFileRoute('/admin/apps/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formData, setFormData] = useState<z.infer<typeof createAppSchema>>({
    categoryId: "",
    slug: "",
    appName: "",
    appUrl: "",
    appDescription: "",
    appBadgeLabel: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  
  // File upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    step: 'creating' | 'uploading-avatar' | 'uploading-banner' | 'completed';
    message: string;
  }>({ step: 'completed', message: '' });

  const createAppMutation = useCreateAppMutation();
  const createCategoryMutation = useCreateCategoryMutation();
  const uploadMutation = useUploadMutation();
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setUploadProgress({ step: 'creating', message: 'Creating app...' });

    try {
      // Step 1: Create the app
      const createdApp = await new Promise<any>((resolve, reject) => {
        createAppMutation.mutate(formData, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      });

      if (!createdApp?.id) {
        throw new Error('Failed to create app - no ID returned');
      }

      // Step 2: Upload avatar if provided
      if (avatarFile) {
        setUploadProgress({ step: 'uploading-avatar', message: 'Uploading avatar...' });
        await new Promise<void>((resolve, reject) => {
          uploadMutation.mutate({
            file: avatarFile,
            resourceType: 'applogo',
            resourceId: createdApp.id,
            endpoint: 'apps'
          }, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
        });
      }

      // Step 3: Upload banner if provided
      if (bannerFile) {
        setUploadProgress({ step: 'uploading-banner', message: 'Uploading banner...' });
        await new Promise<void>((resolve, reject) => {
          uploadMutation.mutate({
            file: bannerFile,
            resourceType: 'appbanner',
            resourceId: createdApp.id,
            endpoint: 'apps'
          }, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
        });
      }

      // Step 4: Reset form and show success
      setUploadProgress({ step: 'completed', message: 'App created successfully!' });
      setFormData({
        categoryId: "",
        slug: "",
        appName: "",
        appUrl: "",
        appDescription: "",
        appBadgeLabel: "",
      });
      setAvatarFile(null);
      setBannerFile(null);
      
    } catch (error: any) {
      console.error('Failed to create app:', error);
      setUploadProgress({ step: 'completed', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, createAppMutation, uploadMutation, formData, avatarFile, bannerFile, isSubmitting]);

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

  return <form onSubmit={(e) => {
    e.preventDefault();
  }} className="space-y-4">
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
    <Label>App Logo (Avatar)</Label>
    <UploadAvatar setAvatarFile={setAvatarFile} />
  </div>

  <div className="space-y-2">
    <Label>App Banner</Label>
    <UploadBanner setBannerFile={setBannerFile} />
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

  {/* Progress indicator */}
  {isSubmitting && (
    <div className="space-y-2 p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm font-medium">{uploadProgress.message}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {uploadProgress.step === 'creating' && 'Step 1 of ' + (avatarFile && bannerFile ? '3' : avatarFile || bannerFile ? '2' : '1')}
        {uploadProgress.step === 'uploading-avatar' && 'Step 2 of ' + (bannerFile ? '3' : '2')}
        {uploadProgress.step === 'uploading-banner' && 'Step ' + (avatarFile ? '3' : '2') + ' of ' + (avatarFile ? '3' : '2')}
      </div>
    </div>
  )}

  <div className="flex gap-2 pt-4">
    <Link to="/admin" className="flex-1">
      <Button type="button" variant="outline" className="w-full" disabled={isSubmitting}>
        Cancel
      </Button>
    </Link>
    <Button 
      type="submit" 
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="flex-1"
    >
      {isSubmitting ? uploadProgress.message : "Create App"}
    </Button>
  </div>
</form>
}