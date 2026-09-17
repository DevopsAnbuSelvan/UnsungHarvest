"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  farmerService,
  type Farmer,
  type FarmerPayload,
} from "@/services/farmer.service";
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
};

export default function SellerFarmersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FarmerPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["seller-farmers"],
    queryFn: () => farmerService.list({ limit: 100 }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) return farmerService.update(editingId, form);
      return farmerService.create(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-farmers"] });
      toast({
        title: editingId ? "Farmer updated" : "Farmer added",
        type: "success",
      });
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    },
    onError: () => {
      toast({ title: "Failed to save farmer", type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => farmerService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-farmers"] });
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
    });
    setShowForm(true);
  };

  const setField = (key: keyof FarmerPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manage Farmers</h1>
            <p className="text-sm text-muted-foreground">
              Only farmers you add appear here and in your product form. You earn 5% per sale.
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
                      placeholder="e.g. 2 acres"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Crops</Label>
                  <Input
                    value={form.crops}
                    onChange={(e) => setField("crops", e.target.value)}
                    placeholder="Millet, Ragi, ..."
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
            <CardTitle>Your farmers ({farmers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : farmers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No farmers yet.{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => setShowForm(true)}
                >
                  Add one
                </button>{" "}
                before listing products.
              </p>
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
                        {[farmer.village, farmer.district, farmer.state]
                          .filter(Boolean)
                          .join(", ") || "Location not set"}
                        {farmer.crops ? ` · ${farmer.crops}` : ""}
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
                      <Link href="/seller/products/add">
                        <Button size="sm" variant="ghost">
                          Add product
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}
