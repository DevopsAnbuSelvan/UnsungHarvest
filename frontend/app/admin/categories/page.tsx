"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin";
import type { Category } from "@/types/admin";
import { useToast } from "@/components/ui/toast-context";

type FormState = { name: string; description: string };

const empty: FormState = { name: "", description: "" };

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminService.getCategories,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return adminService.updateCategory(editingId, {
          name: form.name,
          description: form.description || undefined,
        });
      }
      return adminService.createCategory({
        name: form.name,
        description: form.description || undefined,
      });
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Category updated" : "Category created",
        type: "success",
      });
      setForm(empty);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save category";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Category deleted", type: "success" });
    },
    onError: () => toast({ title: "Failed to delete", type: "error" }),
  });

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || "" });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(empty);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Category" : "New Category"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name.trim()) {
                    toast({ title: "Name required", type: "error" });
                    return;
                  }
                  saveMutation.mutate();
                }}
              >
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm(empty);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">{cat.slug}</p>
                  {cat.description && (
                    <p className="text-sm mt-1">{cat.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(cat)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm(`Delete ${cat.name}?`)) {
                        deleteMutation.mutate(cat.id);
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
      </div>
    </AdminLayout>
  );
}
