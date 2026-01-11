"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export function ProductImages({ images, name }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg border bg-background flex items-center justify-center p-4">
        <Image
          src={images[selectedImage]}
          alt={name}
          width={600}
          height={600}
          className="h-[85%] w-[85%] object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "flex-shrink-0 aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors",
                selectedImage === index
                  ? "border-crimson-600"
                  : "border-transparent hover:border-muted-foreground/25"
              )}
            >
              <Image
                src={image}
                alt={`${name} - Image ${index + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
