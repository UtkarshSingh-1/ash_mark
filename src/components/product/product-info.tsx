"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import {
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/cart-context";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    sizes: string[];
    colors: string[];
    stock: number;
    featured: boolean;
    trending: boolean;
    category: {
      name: string;
    };
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { data: session } = useSession();
  const { addToCart: addToCartContext } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const discountPercentage = product.comparePrice
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.price)) /
          Number(product.comparePrice)) *
          100
      )
    : 0;

  const addToCart = async () => {
    // Validate required selections
    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Color Required",
        description: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await addToCartContext(
        product.id,
        quantity,
        selectedSize || undefined,
        selectedColor || undefined
      );
      
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to Wishlist",
          description: "Product has been added to your wishlist",
        });
      } else {
        throw new Error("Failed to add to wishlist");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to add product to wishlist",
        variant: "destructive",
      });
    }
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link has been copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title & Badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.featured && (
            <Badge className="bg-crimson-600">Featured</Badge>
          )}
          {product.trending && <Badge variant="secondary">Trending</Badge>}
          <Badge variant="outline">{product.category.name}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold">
          {formatPrice(Number(product.price))}
        </span>
        {product.comparePrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(Number(product.comparePrice))}
            </span>
            <Badge className="bg-green-600">{discountPercentage}% OFF</Badge>
          </>
        )}
      </div>

      <Separator />

      {/* Size Selection */}
      {product.sizes.length > 0 && (
        <div className="space-y-3">
          <Label>Size</Label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div className="space-y-3">
          <Label>Color</Label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {product.colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <Label>Quantity</Label>
        <Select
          value={quantity.toString()}
          onValueChange={(value) => setQuantity(parseInt(value))}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: Math.min(10, product.stock) },
              (_, i) => i + 1
            ).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button
          onClick={addToCart}
          disabled={isLoading || product.stock === 0}
          className="w-full bg-crimson-600 hover:bg-crimson-700"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isLoading
            ? "Adding..."
            : product.stock === 0
            ? "Out of Stock"
            : "Add to Cart"}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={addToWishlist} className="flex-1">
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>
          <Button variant="outline" onClick={shareProduct}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span>Free shipping on orders over ₹1000</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>2-year warranty included</span>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
