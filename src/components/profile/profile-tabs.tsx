"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistory } from "@/components/profile/order-history"
import { AddressBook } from "@/components/profile/address-book"
import { WishlistView } from "@/components/profile/wishlist-view"
import { SimplifiedAccountSettings } from "@/components/profile/simplified-account-settings"
import { 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Settings
} from "lucide-react"

interface ProfileTabsProps {
  userId: string
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList className="grid grid-cols-4 w-full bg-background border-0 shadow-md p-1 mb-6">
        <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-crimson-600 data-[state=active]:text-white">
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Orders</span>
        </TabsTrigger>
        <TabsTrigger value="addresses" className="flex items-center gap-2 data-[state=active]:bg-crimson-600 data-[state=active]:text-white">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Addresses</span>
        </TabsTrigger>
        <TabsTrigger value="wishlist" className="flex items-center gap-2 data-[state=active]:bg-crimson-600 data-[state=active]:text-white">
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline">Wishlist</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-crimson-600 data-[state=active]:text-white">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="orders">
        <OrderHistory userId={userId} />
      </TabsContent>
      
      <TabsContent value="addresses">
        <AddressBook userId={userId} />
      </TabsContent>
      
      <TabsContent value="wishlist">
        <WishlistView userId={userId} />
      </TabsContent>
      
      <TabsContent value="settings">
        <SimplifiedAccountSettings userId={userId} />
      </TabsContent>
    </Tabs>
  )
}
