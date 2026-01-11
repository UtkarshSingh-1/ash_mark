import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export function EmptyCart() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
        </p>
        <Button asChild className="bg-crimson-600 hover:bg-crimson-700">
          <Link href="/products">
            Continue Shopping
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
