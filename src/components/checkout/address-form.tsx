"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, MapPin, Edit, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { INDIAN_STATES } from "@/lib/indianStates"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"

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
  selectedAddress: Address | null
  onAddressSelectAction: (address: Address) => void
  onAddressUpdateAction: () => void
}

export function AddressForm({
  selectedAddress,
  onAddressSelectAction,
  onAddressUpdateAction
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
  })

  const [userAddresses, setUserAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses")
      if (res.ok) {
        const data = await res.json()
        setUserAddresses(data.addresses)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const isValidName = (n: string) => /^[A-Za-z\s]{1,25}$/.test(n)
  const isValidPhone = (p: string) => /^[0-9]{10}$/.test(p)
  const isValidPincode = (z: string) => /^[0-9]{6}$/.test(z)

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidName(formData.name)) {
      return toast({
        title: "Invalid Name",
        description: "Only letters allowed, max 25 chars.",
        variant: "destructive",
      })
    }

    if (!isValidPhone(formData.phone)) {
      return toast({
        title: "Invalid Phone",
        description: "Phone must be 10 digits.",
        variant: "destructive",
      })
    }

    if (!isValidPincode(formData.pincode)) {
      return toast({
        title: "Invalid Pincode",
        description: "Pincode must be 6 digits.",
        variant: "destructive",
      })
    }

    if (!formData.state) {
      return toast({
        title: "Invalid State",
        description: "Please select a State.",
        variant: "destructive",
      })
    }

    try {
      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : "/api/addresses"
      const method = editingAddress ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
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
        fetchAddresses()
        onAddressUpdateAction()
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr)
    setFormData({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
    })
    setIsAddingNew(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return

    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Deleted", description: "Address removed." })
        fetchAddresses()
        onAddressUpdateAction()
      }
    } catch {}
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
        <CardDescription>Select your delivery address</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* EXISTING ADDRESS LIST */}
        {userAddresses.length > 0 && (
          <RadioGroup
            value={selectedAddress?.id || ""}
            onValueChange={(value) => {
              const addr = userAddresses.find(a => a.id === value)
              if (addr) onAddressSelectAction(addr)
            }}
          >
            <div className="space-y-3">
              {userAddresses.map((addr) => (
                <div key={addr.id} className="flex items-start space-x-3 p-3 bg-muted/30">
                  <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                  <Label htmlFor={addr.id} className="cursor-pointer flex-1">
                    <div className="font-medium">{addr.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {addr.street}, {addr.city}, {addr.state} {addr.pincode}
                    </div>
                    <div className="text-sm text-muted-foreground">Phone: {addr.phone}</div>
                  </Label>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(addr)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(addr.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        <Separator />

        {/* ADD / EDIT DIALOG */}
        <Dialog
          open={isAddingNew}
          onOpenChange={(open) => {
            setIsAddingNew(open)
            if (!open) {
              setEditingAddress(null)
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add Address"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3">

              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  maxLength={25}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value.replace(/[^A-Za-z\s]/g, "") })
                  }
                  required
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })
                  }
                  required
                />
              </div>

              <div>
                <Label>Street</Label>
                <Input
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              {/* STATE DROPDOWN */}
              <div>
                <Label>State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(val) => setFormData({ ...formData, state: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto"
                  >
                    {INDIAN_STATES.map((st) => (
                      <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* PINCODE */}
              <div>
                <Label>Pincode</Label>
                <Input
                  value={formData.pincode}
                  maxLength={6}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, "") })
                  }
                  required
                />
              </div>

              {/* COUNTRY FIXED */}
              <div>
                <Label>Country</Label>
                <Input
                  value="India"
                  disabled
                  className="bg-muted/50 text-muted-foreground"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>

            </form>

          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  )
}
