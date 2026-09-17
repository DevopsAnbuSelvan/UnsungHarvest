"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sellerService } from "@/services/seller.service";
import { categoryService } from "@/services/category.service";
import { seasonService } from "@/services/season.service";
import { farmerService } from "@/services/farmer.service";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { useToast } from "@/components/ui/toast-context";
import Link from "next/link";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<File[]>([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const { data: seasons } = useQuery({
    queryKey: ["seasons"],
    queryFn: seasonService.getAll,
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ["seller-farmers"],
    queryFn: () => farmerService.list(),
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { isGiTagged: false, season: [], availabilityMonths: [], farmerId: "" },
  });

  const selectedSeasons = watch("season") ?? [];
  const selectedMonths = watch("availabilityMonths") ?? [];
  const isGiTagged = watch("isGiTagged");

  const toggleSeason = (name: string) => {
    const next = selectedSeasons.includes(name)
      ? selectedSeasons.filter((x) => x !== name)
      : [...selectedSeasons, name];
    setValue("season", next, { shouldValidate: true });
  };

  const toggleMonth = (month: number) => {
    const next = selectedMonths.includes(month)
      ? selectedMonths.filter((x) => x !== month)
      : [...selectedMonths, month];
    setValue("availabilityMonths", next);
  };

  const createProduct = useMutation({
    mutationFn: (data: ProductFormData) => {
      const seasonId = seasons?.find((s) => s.name === data.season[0])?.id;
      return sellerService.createProduct(
        { ...data, seasonId },
        images
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast({ title: "Product created!", type: "success" });
      router.push("/seller/products");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create product";
      toast({ title: message, type: "error" });
    },
  });

  return (
    <SellerLayout>
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Add New Product</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => createProduct.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Local Name</Label>
              <Input {...register("localName")} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} {...register("description")} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" step="0.01" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" {...register("stock")} />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Farmer *</Label>
              {farmers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No farmers yet.{" "}
                  <Link href="/seller/farmers" className="text-primary underline">
                    Add a farmer
                  </Link>{" "}
                  first (you earn 5% of each sale).
                </p>
              ) : (
                <Select {...register("farmerId")}>
                  <option value="">Select farmer</option>
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                      {f.village ? ` — ${f.village}` : ""}
                    </option>
                  ))}
                </Select>
              )}
              {errors.farmerId && (
                <p className="text-xs text-destructive">{errors.farmerId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select {...register("categoryId")}>
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Season</Label>
              <div className="flex flex-wrap gap-2">
                {seasons?.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
                    size="sm"
                    variant={selectedSeasons.includes(s.name) ? "default" : "outline"}
                    onClick={() => toggleSeason(s.name)}
                  >
                    {s.name}
                  </Button>
                ))}
              </div>
              {errors.season && <p className="text-xs text-destructive">{errors.season.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Availability Months</Label>
              <div className="flex flex-wrap gap-1">
                {MONTHS.map((m, i) => (
                  <Button
                    key={m}
                    type="button"
                    size="sm"
                    variant={selectedMonths.includes(i + 1) ? "default" : "outline"}
                    onClick={() => toggleMonth(i + 1)}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cultivation Place</Label>
              <Input {...register("cultivationPlace")} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="gi" {...register("isGiTagged")} className="accent-primary" />
              <Label htmlFor="gi">GI Tagged Product</Label>
            </div>
            {isGiTagged && (
              <div className="space-y-2">
                <Label>GI Tag Number</Label>
                <Input {...register("giTagNumber")} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
            </div>
            <Button type="submit" disabled={createProduct.isPending} className="w-full">
              {createProduct.isPending ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </SellerLayout>
  );
}
