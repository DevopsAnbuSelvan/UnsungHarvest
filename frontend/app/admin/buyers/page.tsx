"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  type CreateBuyerPayload,
  type UpdateBuyerPayload,
} from "@/services/admin";
import type { User } from "@/types/auth";
import { useToast } from "@/components/ui/toast-context";

type BuyerForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
  bio: string;
  status: string;
};

const emptyForm: BuyerForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  bio: "",
  status: "active",
};

export default function ManageBuyersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BuyerForm>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-buyers", page, search],
    queryFn: () => adminService.getBuyers(page, 10, search || undefined),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-buyers"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const payload: UpdateBuyerPayload = {
          id: editingId,
          name: form.name || undefined,
          phone: form.phone || undefined,
          bio: form.bio || undefined,
          status: form.status || undefined,
        };
        return adminService.updateBuyer(payload);
      }
      const payload: CreateBuyerPayload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        bio: form.bio || undefined,
      };
      return adminService.createBuyer(payload);
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Buyer updated" : "Buyer created",
        type: "success",
      });
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save buyer";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBuyer(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Buyer deleted", type: "success" });
    },
    onError: () => toast({ title: "Failed to delete buyer", type: "error" }),
  });

  const startEdit = (buyer: User) => {
    setEditingId(buyer.id);
    setForm({
      name: `${buyer.firstName} ${buyer.lastName}`.trim(),
      email: buyer.email,
      password: "",
      phone: buyer.phone || "",
      bio: "",
      status: buyer.isActive ? "active" : "inactive",
    });
    setShowForm(true);
  };

  const setField = (key: keyof BuyerForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Manage Buyers</h2>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Buyer
          </Button>
        </div>

        <div className="max-w-sm">
          <Input
            placeholder="Search buyers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Buyer" : "New Buyer"}</CardTitle>
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
                    <Label>Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                  </div>
                  {editingId && (
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onChange={(e) => setField("status", e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </Select>
                    </div>
                  )}
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
                    {saveMutation.isPending ? "Saving..." : "Save Buyer"}
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

        <div className="space-y-3">
          {data?.data.map((buyer) => (
            <Card key={buyer.id}>
              <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold">
                    {buyer.firstName} {buyer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{buyer.email}</p>
                  {buyer.phone && (
                    <p className="text-sm text-muted-foreground">{buyer.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={buyer.isActive ? "default" : "destructive"}>
                    {buyer.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(buyer)}
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
                          `Delete buyer ${buyer.firstName} ${buyer.lastName}?`
                        )
                      ) {
                        deleteMutation.mutate(buyer.id);
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
