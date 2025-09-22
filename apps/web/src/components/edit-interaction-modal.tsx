import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Loader2 } from 'lucide-react'
import { useUpdateInteractionMutation } from '@/lib/mutations'
import { rewardQueries } from '@/lib/queries'
import type { PartnerInteraction } from '@mini/types'
import { toast } from 'sonner'

interface EditInteractionModalProps {
  interaction: PartnerInteraction
  appId: string
}

export function EditInteractionModal({ interaction, appId }: EditInteractionModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: interaction.title || '',
    description: interaction.description || '',
    actionTitle: interaction.actionTitle || '',
    interactionUrl: interaction.interactionUrl || '',
    verificationType: interaction.verificationType || 'none',
    rewardId: interaction.rewardId || '',
  })

  const updateInteractionMutation = useUpdateInteractionMutation()

  // Fetch rewards for the dropdown
  const { data: rewards, isLoading: rewardsLoading } = useQuery(
    rewardQueries.listOptions()
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.interactionUrl.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await updateInteractionMutation.mutateAsync({
        interactionId: interaction.id,
        appId: appId,
        ...formData,
      })
      
      setOpen(false)
    } catch (error) {
      console.error('Failed to update interaction:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-3 h-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Interaction</DialogTitle>
          <DialogDescription>
            Update the interaction details for this app.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter interaction title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionTitle">Action Title</Label>
              <Input
                id="actionTitle"
                value={formData.actionTitle}
                onChange={(e) => handleInputChange('actionTitle', e.target.value)}
                placeholder="Enter action title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter interaction description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interactionUrl">Interaction URL *</Label>
            <Input
              id="interactionUrl"
              value={formData.interactionUrl}
              onChange={(e) => handleInputChange('interactionUrl', e.target.value)}
              placeholder="Enter interaction URL"
              type="url"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="verificationType">Verification Type</Label>
              <Select
                value={formData.verificationType}
                onValueChange={(value) => handleInputChange('verificationType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select verification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rewardId">Reward</Label>
              <Select
                value={formData.rewardId}
                onValueChange={(value) => handleInputChange('rewardId', value)}
                disabled={rewardsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reward" />
                </SelectTrigger>
                <SelectContent>
                  {rewards?.map((reward) => (
                    <SelectItem key={reward.id} value={reward.id}>
                      {reward.title} ({reward.rewardType} - {reward.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateInteractionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateInteractionMutation.isPending}
            >
              {updateInteractionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Interaction'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
