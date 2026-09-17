"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  farmerService,
  type Farmer,
  type FarmerPayload,
} from "@/services/farmer.service";
import { adminService } from "@/services/admin";
import { useToast } from "@/components/ui/toast-context";

const emptyForm: FarmerPayload = {
  name: "",
  phone: "",
  village: "",
  district: "",
  state: "",
  farmSize: "",
  crops: "",
  bio: "",
  sellerId: "",
};

export default function AdminFarmersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FarmerPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterSellerId, setFilterSellerId] = useState("");

  const { data: sellersPage } = useQuery({
    queryKey: ["admin-sellers-for-farmers"],
    queryFn: () => adminService.getSellers("APPROVED", 1, 100),
  });
  const sellers = sellersPage?.data ?? [];

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["admin-farmers", filterSellerId],
    queryFn: () =>
      farmerService.list({
        limit: 100,
        sellerId: filterSellerId || undefined,
      }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { sellerId: _s, ...rest } = form;
        return farmerService.update(editingId, rest);
      }
      if (!form.sellerId) {
        throw new Error("Select a seller");
      }
      return farmerService.create(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-farmers"] });
      toast({
        title: editingId ? "Farmer updated" : "Farmer added",
        type: "success",
      });
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to save farmer";
      toast({ title: message, type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => farmerService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-farmers"] });
      toast({ title: "Farmer removed", type: "success" });
    },
    onError: () => toast({ title: "Failed to delete farmer", type: "error" }),
  });

  const startEdit = (farmer: Farmer) => {
    setEditingId(farmer.id);
    setForm({
      name: farmer.name,
      phone: farmer.phone || "",
      village: farmer.village || "",
      district: farmer.district || "",
      state: farmer.state || "",
      farmSize: farmer.farmSize || "",
      crops: farmer.crops || "",
      bio: farmer.bio || "",
      sellerId: farmer.sellerId,
    });
    setShowForm(true);
  };

  const setField = (key: keyof FarmerPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sellerLabel = (farmer: Farmer) =>
    farmer.seller?.businessName ||
    farmer.seller?.user?.name ||
    farmer.seller?.user?.email ||
    farmer.sellerId.slice(0, 8);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Farmers</h1>
            <p className="text-sm text-muted-foreground">
              View all farmers. Sellers only see farmers they added; here you see everyone.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Farmer
          </Button>
        </div>

        <div className="max-w-xs space-y-2">
          <Label>Filter by seller</Label>
          <Select
            value={filterSellerId}
            onChange={(e) => setFilterSellerId(e.target.value)}
          >
            <option value="">All sellers</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.farmName || `${s.firstName} ${s.lastName}`.trim() || s.email}
              </option>
            ))}
          </Select>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Farmer" : "New Farmer"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name.trim()) {
                    toast({ title: "Name is required", type: "error" });
                    return;
                  }
                  if (!editingId && !form.sellerId) {
                    toast({ title: "Select a seller", type: "error" });
                    return;
                  }
                  saveMutation.mutate();
                }}
              >
                {!editingId && (
                  <div className="space-y-2">
                    <Label>Seller (student) *</Label>
                    <Select
                      value={form.sellerId || ""}
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
                    <Label>Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Village</Label>
                    <Input
                      value={form.village}
                      onChange={(e) => setField("village", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input
                      value={form.district}
                      onChange={(e) => setField("district", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Farm size</Label>
                    <Input
                      value={form.farmSize}
                      onChange={(e) => setField("farmSize", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Crops</Label>
                  <Input
                    value={form.crops}
                    onChange={(e) => setField("crops", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setField("bio", e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save Farmer"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All farmers ({farmers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : farmers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No farmers found.</p>
            ) : (
              <ul className="divide-y">
                {farmers.map((farmer) => (
                  <li
                    key={farmer.id}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{farmer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Seller: {sellerLabel(farmer)}
                        {" · "}
                        {[farmer.village, farmer.district, farmer.state]
                          .filter(Boolean)
                          .join(", ") || "Location not set"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(farmer)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm(`Remove ${farmer.name}?`)) {
                            deleteMutation.mutate(farmer.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
