import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { ProductFilters } from "@/types/product";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getAll(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: productService.getFeatured,
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: productService.getTrending,
  });
}

export function useRecentProducts() {
  return useQuery({
    queryKey: ["products", "recent"],
    queryFn: productService.getRecent,
  });
}

export function useSeasonalProducts() {
  return useQuery({
    queryKey: ["products", "seasonal"],
    queryFn: productService.getSeasonal,
  });
}

export function useGiTaggedProducts() {
  return useQuery({
    queryKey: ["products", "gi-tagged"],
    queryFn: productService.getGiTagged,
  });
}
