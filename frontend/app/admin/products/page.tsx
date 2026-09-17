"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  adminService,
  type AdminCreateProductPayload,
  type AdminUpdateProductPayload,
} from "@/services/admin";
import { farmerService } from "@/services/farmer.service";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";
import type { PendingProduct } from "@/types/admin";
import { useToast } from "@/components/ui/toast-context";

type ProductForm = {
  name: string;
  localName: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  sellerId: string;
  farmerId: string;
};

const emptyForm: ProductForm = {
  name: "",
  localName: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  sellerId: "",
  farmerId: "",
};

export default function ManageProductsPage() {
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-products", status, page],
    queryFn: () => adminService.getProducts(status, page),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminService.getCategories,
  });

  const { data: sellersPage } = useQuery({
    queryKey: ["admin-sellers-for-products"],
    queryFn: () => adminService.getSellers("APPROVED", 1, 100),
  });
  const sellers = sellersPage?.data ?? [];

  const { data: farmers = [] } = useQuery({
    queryKey: ["admin-farmers-for-products", form.sellerId],
    queryFn: () =>
      farmerService.list({
        limit: 100,
        sellerId: form.sellerId || undefined,
      }),
    enabled: !!form.sellerId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setImages([]);
    setExistingImages([]);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const payload: AdminUpdateProductPayload = {
          id: editingId,
          name: form.name,
          localName: form.localName || undefined,
          description: form.description || undefined,
          price: Number(form.price),
          stock: Number(form.stock),
          categoryId: form.categoryId,
          farmerId: form.farmerId || undefined,
        };
        return adminService.updateProduct(payload, images);
      }
      const payload: AdminCreateProductPayload = {
        name: form.name,
        localName: form.localName || undefined,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
        sellerId: form.sellerId,
        farmerId: form.farmerId || undefined,
      };
      return adminService.createProduct(payload, images);
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Product updated" : "Product created",
        type: "success",
      });
      resetForm();
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save product";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Product deleted", type: "success" });
    },
    onError: () => toast({ title: "Failed to delete product", type: "error" }),
  });

  const approve = useMutation({
    mutationFn: adminService.approveProduct,
    onSuccess: () => {
      invalidate();
      toast({ title: "Product approved", type: "success" });
    },
  });

  const reject = useMutation({
    mutationFn: (id: string) => adminService.rejectProduct(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Product rejected", type: "warning" });
    },
  });

  const startEdit = (product: PendingProduct) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      localName: product.localName || "",
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      farmerId: "",
    });
    setExistingImages(product.images ?? []);
    setImages([]);
    setShowForm(true);
  };

  const setField = (key: keyof ProductForm, value: string) => {
    setForm((prev) => {
      if (key === "sellerId") {
        return { ...prev, sellerId: value, farmerId: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <div className="flex gap-2">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-40"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </Select>
            <Button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setImages([]);
                setExistingImages([]);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Product" : "New Product"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name.trim() || !form.categoryId) {
                    toast({
                      title: "Name and category are required",
                      type: "error",
                    });
                    return;
                  }
                  if (!editingId && !form.sellerId) {
                    toast({ title: "Select a seller", type: "error" });
                    return;
                  }
                  if (!form.price || !form.stock) {
                    toast({ title: "Price and stock required", type: "error" });
                    return;
                  }
                  saveMutation.mutate();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Local name</Label>
                    <Input
                      value={form.localName}
                      onChange={(e) => setField("localName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price *</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setField("price", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock *</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.stock}
                      onChange={(e) => setField("stock", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={form.categoryId}
                      onChange={(e) => setField("categoryId", e.target.value)}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  {!editingId && (
                    <div className="space-y-2">
                      <Label>Seller *</Label>
                      <Select
                        value={form.sellerId}
                        onChange={(e) => setField("sellerId", e.target.value)}
                        required
                      >
                        <option value="">Select seller</option>
                        {sellers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.farmName ||
                              `${s.firstName} ${s.lastName}`.trim() ||
                              s.email}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Farmer</Label>
                    <Select
                      value={form.farmerId}
                      onChange={(e) => setField("farmerId", e.target.value)}
                      disabled={!form.sellerId}
                    >
                      <option value="">Optional</option>
                      {farmers.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((url) => (
                        <img
                          key={url}
                          src={resolveImageUrl(url)}
                          alt="Product"
                          className="h-16 w-16 rounded object-cover border"
                        />
                      ))}
                    </div>
                  )}
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setImages(Array.from(e.target.files || []))
                    }
                  />
                  {images.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {images.length} new image(s) selected
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {data?.data.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex gap-3 items-start">
                  {product.images?.[0] ? (
                    <img
                      src={resolveImageUrl(product.images[0])}
                      alt={product.name}
                      className="h-16 w-16 rounded object-cover border shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded border bg-muted shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      by {product.sellerName}
                    </p>
                    <p className="text-primary font-bold">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {product.status.toLowerCase()}
                  </Badge>
                  {product.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => approve.mutate(product.id)}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => reject.mutate(product.id)}
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(product)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm(`Delete product ${product.name}?`)) {
                        deleteMutation.mutate(product.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            className="mt-8"
          />
        )}
      </div>
    </AdminLayout>
  );
}
