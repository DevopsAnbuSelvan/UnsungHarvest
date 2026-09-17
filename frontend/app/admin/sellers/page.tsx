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
  type CreateSellerPayload,
  type UpdateSellerPayload,
} from "@/services/admin";
import type { SellerWithStatus } from "@/types/admin";
import { useToast } from "@/components/ui/toast-context";

type SellerForm = {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
  businessDescription: string;
  commissionPercent: string;
  status: string;
};

const emptyForm: SellerForm = {
  name: "",
  email: "",
  password: "",
  businessName: "",
  phone: "",
  businessDescription: "",
  commissionPercent: "5",
  status: "APPROVED",
};

export default function ManageSellersPage() {
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SellerForm>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-sellers", status, page],
    queryFn: () => adminService.getSellers(status, page),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const payload: UpdateSellerPayload = {
          id: editingId,
          name: form.name || undefined,
          phone: form.phone || undefined,
          businessName: form.businessName || undefined,
          businessDescription: form.businessDescription || undefined,
          status: form.status || undefined,
          commissionPercent: form.commissionPercent
            ? Number(form.commissionPercent)
            : undefined,
        };
        return adminService.updateSeller(payload);
      }
      const payload: CreateSellerPayload = {
        name: form.name,
        email: form.email,
        password: form.password,
        businessName: form.businessName,
        phone: form.phone || undefined,
        businessDescription: form.businessDescription || undefined,
        commissionPercent: form.commissionPercent
          ? Number(form.commissionPercent)
          : 5,
      };
      return adminService.createSeller(payload);
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Seller updated" : "Seller created",
        type: "success",
      });
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save seller";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteSeller(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Seller deleted", type: "success" });
    },
    onError: () => toast({ title: "Failed to delete seller", type: "error" }),
  });

  const approve = useMutation({
    mutationFn: adminService.approveSeller,
    onSuccess: () => {
      invalidate();
      toast({ title: "Seller approved", type: "success" });
    },
  });

  const reject = useMutation({
    mutationFn: (id: string) => adminService.rejectSeller(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Seller rejected", type: "warning" });
    },
  });

  const startEdit = (seller: SellerWithStatus) => {
    setEditingId(seller.id);
    setForm({
      name: `${seller.firstName} ${seller.lastName}`.trim(),
      email: seller.email,
      password: "",
      businessName: seller.farmName || "",
      phone: seller.phone || "",
      businessDescription: "",
      commissionPercent: "5",
      status: seller.status,
    });
    setShowForm(true);
  };

  const setField = (key: keyof SellerForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Manage Sellers</h2>
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
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Seller
            </Button>
          </div>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Seller" : "New Seller"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name.trim() || !form.businessName.trim()) {
                    toast({ title: "Name and business name required", type: "error" });
                    return;
                  }
                  if (!editingId && (!form.email.trim() || form.password.length < 6)) {
                    toast({
                      title: "Email and password (min 6) required",
                      type: "error",
                    });
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
                  {!editingId && (
                    <>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password *</Label>
                        <Input
                          type="password"
                          value={form.password}
                          onChange={(e) => setField("password", e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label>Business name *</Label>
                    <Input
                      value={form.businessName}
                      onChange={(e) => setField("businessName", e.target.value)}
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
                    <Label>Commission %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={form.commissionPercent}
                      onChange={(e) =>
                        setField("commissionPercent", e.target.value)
                      }
                    />
                  </div>
                  {editingId && (
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onChange={(e) => setField("status", e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Business description</Label>
                  <Textarea
                    rows={3}
                    value={form.businessDescription}
                    onChange={(e) =>
                      setField("businessDescription", e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save Seller"}
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

        <div className="space-y-4">
          {data?.data.map((seller) => (
            <Card key={seller.id}>
              <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold">
                    {seller.firstName} {seller.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{seller.email}</p>
                  {seller.farmName && (
                    <p className="text-sm">{seller.farmName}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {seller.status.toLowerCase()}
                  </Badge>
                  {seller.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => approve.mutate(seller.id)}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => reject.mutate(seller.id)}
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(seller)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (
                        confirm(
                          `Delete seller ${seller.firstName} ${seller.lastName}?`
                        )
                      ) {
                        deleteMutation.mutate(seller.id);
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
