"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, MapPin, Edit, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
}

interface AddressFormProps {
  addresses: Address[]
  selectedAddress: Address | null
  onAddressSelect: (address: Address) => void
  onAddressUpdate: () => void
}

export function AddressForm({
  selectedAddress,
  onAddressSelect,
  onAddressUpdate
}: AddressFormProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  })

  const [userAddresses, setUserAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = await response.json()
        setUserAddresses(data.addresses)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async (addressData: any) => {
    try {
      const url = editingAddress 
        ? `/api/addresses/${editingAddress.id}`
        : '/api/addresses'
      
      const method = editingAddress ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message,
        })
        fetchAddresses() // Refresh addresses
        setIsAddingNew(false)
        setEditingAddress(null)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save address')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message,
        })
        fetchAddresses() // Refresh addresses
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete address')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/set-default`, {
        method: 'PUT',
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message,
        })
        fetchAddresses() // Refresh addresses
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update default address')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingAddress 
        ? `/api/addresses/${editingAddress.id}`
        : '/api/addresses'
      
      const method = editingAddress ? 'PUT' : 'POST'

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
          description: editingAddress ? "Address updated successfully" : "Address added successfully",
        })
        setIsAddingNew(false)
        setEditingAddress(null)
        resetForm()
        onAddressUpdate()
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

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
    })
    setEditingAddress(address)
    setIsAddingNew(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Address deleted successfully",
        })
        onAddressUpdate()
      } else {
        throw new Error('Failed to delete address')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
        <CardDescription>Choose where you want your order to be delivered</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userAddresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No addresses found</h3>
            <p className="text-muted-foreground mb-4">
              Add a delivery address to proceed with your order
            </p>
          </div>
        ) : (
          <RadioGroup
            value={selectedAddress?.id || ""}
            onValueChange={(value: any) => {
              const address = userAddresses.find(addr => addr.id === value)
              if (address) onAddressSelect(address)
            }}
          >
            <div className="space-y-3">
              {userAddresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3 p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={address.id} className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs border-0">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>{address.street}</div>
                        <div>{address.city}, {address.state} {address.pincode}</div>
                        <div>{address.country}</div>
                        <div>Phone: {address.phone}</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 border-0"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 border-0 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        <Separator />

        <Dialog open={isAddingNew} onOpenChange={(open) => {
          setIsAddingNew(open)
          if (!open) {
            setEditingAddress(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full border-0 bg-muted/30">
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="border-0 max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your address details' : 'Add a new delivery address'}
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
                  onClick={() => setIsAddingNew(false)}
                  className="border-0"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-crimson-600 hover:bg-crimson-700 border-0">
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
