"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
  type?: 'home' | 'work' | 'other'
}

interface EditAddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: Address | null
  onSave: () => void
}

export function EditAddressDialog({ open, onOpenChange, address, onSave }: EditAddressDialogProps) {
  const [formData, setFormData] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || "",
    country: address?.country || "India",
    type: address?.type || "home" as 'home' | 'work' | 'other',
    isDefault: address?.isDefault || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = address 
        ? `/api/addresses/${address.id}`
        : '/api/addresses'
      
      const method = address ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: address ? "Address updated successfully" : "Address added successfully",
        })
        onSave()
      } else {
        throw new Error('Failed to save address')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {address ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogDescription>
            {address ? 'Update your address details' : 'Add a new delivery address'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border-0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Address Type</Label>
              <Select value={formData.type} onValueChange={(value: 'home' | 'work' | 'other') => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-0">
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                className="border-0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="border-0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  className="border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  className="border-0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-0"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-crimson-600 hover:bg-crimson-700 border-0">
              {address ? 'Update Address' : 'Add Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
