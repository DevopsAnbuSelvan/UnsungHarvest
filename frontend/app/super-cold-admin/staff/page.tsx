"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { SuperColdAdminLayout } from "@/components/layout/super-cold-admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  superColdAdminService,
  type StaffUser,
} from "@/services/super-cold-admin";
import { useToast } from "@/components/ui/toast-context";

type FormState = {
  name: string;
  email: string;
  password: string;
  department: string;
  phone: string;
  status: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  password: "",
  department: "",
  phone: "",
  status: "active",
};

export default function ManageAdminsPage() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["staff-admins", page],
    queryFn: () => superColdAdminService.listAdmins(page),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["staff-admins"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return superColdAdminService.updateAdmin({
          id: editingId,
          name: form.name || undefined,
          phone: form.phone || undefined,
          department: form.department || undefined,
          status: form.status || undefined,
        });
      }
      return superColdAdminService.createAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department || undefined,
      });
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Admin updated" : "Admin created",
        type: "success",
      });
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save admin";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => superColdAdminService.deleteAdmin(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Admin deleted", type: "success" });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete admin";
      toast({ title: String(message), type: "error" });
    },
  });

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const startEdit = (user: StaffUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      department: user.adminProfile?.department || "",
      phone: user.phone || "",
      status: user.status || "active",
    });
    setShowForm(true);
  };

  return (
    <SuperColdAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Manage Admins</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage Admin accounts. You are the only Super Cold Admin.
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
            Add Admin
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Admin" : "New Admin"}</CardTitle>
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
                  if (
                    !editingId &&
                    (!form.email.trim() || form.password.length < 6)
                  ) {
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
                    <Label>Department</Label>
                    <Input
                      value={form.department}
                      onChange={(e) => setField("department", e.target.value)}
                    />
                  </div>
                  {editingId && (
                    <>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={form.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                        />
                      </div>
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
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save Admin"}
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
          {data?.data.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.adminProfile?.department && (
                    <p className="text-sm">{user.adminProfile.department}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Admin</Badge>
                  <Badge
                    variant={
                      user.status === "active" ? "default" : "destructive"
                    }
                  >
                    {user.status || "active"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(user)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm(`Delete ${user.name}?`)) {
                        deleteMutation.mutate(user.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {data?.data.length === 0 && (
            <p className="text-sm text-muted-foreground">No admins yet.</p>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            className="mt-8"
          />
        )}
      </div>
    </SuperColdAdminLayout>
  );
}
