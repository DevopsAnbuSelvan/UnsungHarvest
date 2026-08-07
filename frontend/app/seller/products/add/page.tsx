"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sellerService } from "@/services/seller.service";
import { categoryService } from "@/services/category.service";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { useToast } from "@/components/ui/toast-context";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SEASONS = ["Summer","Monsoon","Winter","Spring","Year-round"];

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { isGiTagged: false, season: [], availabilityMonths: [] },
  });

  const isGiTagged = watch("isGiTagged");

  const createProduct = useMutation({
    mutationFn: (data: ProductFormData) =>
      sellerService.createProduct(
        { ...data, season: selectedSeasons, availabilityMonths: selectedMonths },
        images
      ),
    onSuccess: () => {
      toast({ title: "Product created!", type: "success" });
      router.push("/seller/products");
    },
    onError: () => toast({ title: "Failed to create product", type: "error" }),
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
                <Input type="number" {...register("price")} />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" {...register("stock")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select {...register("categoryId")}>
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Season</Label>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={selectedSeasons.includes(s) ? "default" : "outline"}
                    onClick={() =>
                      setSelectedSeasons((prev) =>
                        prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                      )
                    }
                  >
                    {s}
                  </Button>
                ))}
              </div>
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
                    onClick={() =>
                      setSelectedMonths((prev) =>
                        prev.includes(i + 1) ? prev.filter((x) => x !== i + 1) : [...prev, i + 1]
                      )
                    }
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
