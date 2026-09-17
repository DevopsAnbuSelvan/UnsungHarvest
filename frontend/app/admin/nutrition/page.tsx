"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "@/services/admin";
import type { NutritionInfo } from "@/types/product";
import { useToast } from "@/components/ui/toast-context";

type FormState = {
  servingSize: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
  fiber: string;
};

const empty: FormState = {
  servingSize: "",
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",
  fiber: "",
};

export default function AdminNutritionPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["admin-nutrition"],
    queryFn: adminService.getNutrition,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-nutrition"] });

  const toPayload = () => ({
    servingSize: form.servingSize || undefined,
    calories: form.calories ? Number(form.calories) : undefined,
    protein: form.protein ? Number(form.protein) : undefined,
    carbohydrates: form.carbohydrates ? Number(form.carbohydrates) : undefined,
    fat: form.fat ? Number(form.fat) : undefined,
    fiber: form.fiber ? Number(form.fiber) : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return adminService.updateNutrition({ id: editingId, ...toPayload() });
      }
      return adminService.createNutrition(toPayload());
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Nutrition updated" : "Nutrition created",
        type: "success",
      });
      setForm(empty);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteNutrition(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Deleted", type: "success" });
    },
    onError: () => toast({ title: "Failed to delete", type: "error" }),
  });

  const setField = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Nutrition Database</h2>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(empty);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Nutrition
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Nutrition" : "New Nutrition"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveMutation.mutate();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {(
                    [
                      ["servingSize", "Serving size"],
                      ["calories", "Calories"],
                      ["protein", "Protein (g)"],
                      ["carbohydrates", "Carbs (g)"],
                      ["fat", "Fat (g)"],
                      ["fiber", "Fiber (g)"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Input
                        type={key === "servingSize" ? "text" : "number"}
                        step="0.01"
                        value={form[key]}
                        onChange={(e) => setField(key, e.target.value)}
                      />
                    </div>
                  ))}
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
          {data.map((item) => {
            const raw = item as NutritionInfo & {
              carbohydrates?: number;
              servingSize?: string;
            };
            return (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    {raw.servingSize && (
                      <span className="col-span-2">
                        Serving: {raw.servingSize}
                      </span>
                    )}
                    {item.calories != null && (
                      <span>Calories: {item.calories}</span>
                    )}
                    {item.protein != null && (
                      <span>Protein: {item.protein}g</span>
                    )}
                    {(raw.carbohydrates ?? item.carbs) != null && (
                      <span>Carbs: {raw.carbohydrates ?? item.carbs}g</span>
                    )}
                    {item.fiber != null && <span>Fiber: {item.fiber}g</span>}
                    {item.fat != null && <span>Fat: {item.fat}g</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(item.id);
                        setForm({
                          servingSize: raw.servingSize || "",
                          calories: item.calories?.toString() || "",
                          protein: item.protein?.toString() || "",
                          carbohydrates: (
                            raw.carbohydrates ?? item.carbs
                          )?.toString() || "",
                          fat: item.fat?.toString() || "",
                          fiber: item.fiber?.toString() || "",
                        });
                        setShowForm(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm("Delete this nutrition entry?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
