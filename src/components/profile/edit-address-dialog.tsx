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
import { INDIAN_STATES } from "@/lib/indianStates"

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
  onOpenChangeAction: (open: boolean) => void
  address: Address | null
  onSaveAction: () => void
}

export function EditAddressDialog({
  open,
  onOpenChangeAction,
  address,
  onSaveAction,
}: EditAddressDialogProps) {
  const [formData, setFormData] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || "",
    country: "India",
    type: (address?.type || "home") as 'home' | 'work' | 'other',
    isDefault: address?.isDefault || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^[A-Za-z\s]{1,25}$/.test(formData.name)) {
      return toast({
        title: "Invalid Name",
        description: "Name must contain only alphabets (max 25 characters).",
        variant: "destructive",
      })
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return toast({
        title: "Invalid Phone",
        description: "Phone must be 10 digits and numbers only.",
        variant: "destructive",
      })
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      return toast({
        title: "Invalid PIN Code",
        description: "PIN code must be 6 digits.",
        variant: "destructive",
      })
    }

    try {
      const url = address ? `/api/addresses/${address.id}` : '/api/addresses'
      const method = address ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: address ? "Address updated successfully" : "Address added successfully",
        })
        onSaveAction()
      } else {
        throw new Error('Failed to save address')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="border-0 max-w-lg">
        <DialogHeader>
          <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>
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
                  maxLength={25}
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z\s]/g, "")
                    setFormData({ ...formData, name: value })
                  }}
                  required
                  className="border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    setFormData({ ...formData, phone: value })
                  }}
                  required
                  className="border-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'home' | 'work' | 'other') =>
                  setFormData({ ...formData, type: value })
                }
              >
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
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger className="border-0">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="border-0 max-h-60 overflow-y-auto">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    setFormData({ ...formData, pincode: value })
                  }}
                  required
                  className="border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value="India"
                  disabled
                  className="border-0 bg-muted/50 text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeAction(false)}
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
