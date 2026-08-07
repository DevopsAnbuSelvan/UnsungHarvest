"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, MapPin, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-context";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: () => cartService.addItem(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to cart", type: "success" });
    },
    onError: () => {
      toast({ title: "Failed to add to cart", type: "error" });
    },
  });

  const toggleWishlist = useMutation({
    mutationFn: () => wishlistService.toggle(product.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: data.added ? "Added to wishlist" : "Removed from wishlist",
        type: "success",
      });
    },
  });

  const imageUrl = product.images[0] || "/placeholder-product.svg";

  return (
    <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 glass-card">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.isGiTagged && <Badge variant="gi">GI Tagged</Badge>}
            {product.nutrition && <Badge variant="nutrition">Nutrition</Badge>}
            {product.season?.[0] && (
              <Badge variant="season">{product.season[0]}</Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.localName && (
          <p className="text-xs text-muted-foreground italic">
            {product.localName}
          </p>
        )}
        <p className="text-lg font-bold text-primary">
          {formatCurrency(product.price)}
        </p>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {product.seller && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {product.seller.farmName ||
                `${product.seller.firstName} ${product.seller.lastName}`}
            </span>
          )}
          {product.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {product.location.name}, {product.location.state}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          className="flex-1"
          size="sm"
          onClick={() => addToCart.mutate()}
          disabled={addToCart.isPending || product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleWishlist.mutate()}
          disabled={toggleWishlist.isPending}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
