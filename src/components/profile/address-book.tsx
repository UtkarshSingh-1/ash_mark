"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, Home, Building } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { EditAddressDialog } from "@/components/profile/edit-address-dialog"

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

interface AddressBookProps {
  userId: string
}

export function AddressBook({ userId }: AddressBookProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [userId])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr.id !== addressId))
        toast({
          title: "Success",
          description: "Address deleted successfully",
        })
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

  const setDefaultAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/set-default`, {
        method: 'PUT',
      })

      if (response.ok) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        })))
        toast({
          title: "Success",
          description: "Default address updated",
        })
      } else {
        throw new Error('Failed to update default address')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive",
      })
    }
  }

  const handleAddressUpdate = () => {
    setEditDialogOpen(false)
    setEditingAddress(null)
    fetchAddresses()
  }

  const getAddressTypeIcon = (type?: string) => {
    if (type === 'home') return <Home className="w-4 h-4" />
    if (type === 'work') return <Building className="w-4 h-4" />
    return <MapPin className="w-4 h-4" />
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Address Book</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 bg-muted animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted-foreground/20"></div>
                  <div className="h-3 w-full bg-muted-foreground/20"></div>
                  <div className="h-3 w-3/4 bg-muted-foreground/20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Book
            </CardTitle>
            <CardDescription>
              Manage your saved addresses for faster checkout
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setEditingAddress(null)
              setEditDialogOpen(true)
            }}
            className="bg-crimson-600 hover:bg-crimson-700 border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-4">
                Add your first address for faster checkout
              </p>
              <Button 
                onClick={() => {
                  setEditingAddress(null)
                  setEditDialogOpen(true)
                }}
                className="bg-crimson-600 hover:bg-crimson-700 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div key={address.id} className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getAddressTypeIcon(address.type)}
                      <span className="font-semibold">{address.name}</span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs border-0">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 border-0"
                        onClick={() => {
                          setEditingAddress(address)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 border-0 text-red-600 hover:text-red-700"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <div>{address.street}</div>
                    <div>{address.city}, {address.state} {address.pincode}</div>
                    <div>{address.country}</div>
                    <div>Phone: {address.phone}</div>
                  </div>

                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-0 bg-background"
                      onClick={() => setDefaultAddress(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditAddressDialog
        open={editDialogOpen}
        onOpenChangeAction={setEditDialogOpen}
        address={editingAddress}
        onSaveAction={handleAddressUpdate}
      />
    </>
  );
}
