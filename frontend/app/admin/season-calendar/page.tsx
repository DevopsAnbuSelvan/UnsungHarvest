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
import { Select } from "@/components/ui/select";
import { adminService } from "@/services/admin";
import { useToast } from "@/components/ui/toast-context";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type FormState = {
  name: string;
  description: string;
  startMonth: string;
  endMonth: string;
};

const empty: FormState = {
  name: "",
  description: "",
  startMonth: "1",
  endMonth: "12",
};

export default function SeasonCalendarPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["admin-seasons"],
    queryFn: adminService.getSeasons,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-seasons"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        startMonth: Number(form.startMonth),
        endMonth: Number(form.endMonth),
      };
      if (editingId) {
        return adminService.updateSeason({ id: editingId, ...payload });
      }
      return adminService.createSeason(payload);
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Season updated" : "Season created",
        type: "success",
      });
      setForm(empty);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save season";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteSeason(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Season deleted", type: "success" });
    },
    onError: () => toast({ title: "Failed to delete", type: "error" }),
  });

  const setField = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const monthLabel = (n?: number) =>
    n && n >= 1 && n <= 12 ? MONTHS[n - 1] : "?";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Seasons</h2>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(empty);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Season
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Season" : "New Season"}</CardTitle>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start month</Label>
                    <Select
                      value={form.startMonth}
                      onChange={(e) => setField("startMonth", e.target.value)}
                    >
                      {MONTHS.map((m, i) => (
                        <option key={m} value={String(i + 1)}>
                          {m}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>End month</Label>
                    <Select
                      value={form.endMonth}
                      onChange={(e) => setField("endMonth", e.target.value)}
                    >
                      {MONTHS.map((m, i) => (
                        <option key={m} value={String(i + 1)}>
                          {m}
                        </option>
                      ))}
                    </Select>
                  </div>
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
          {data.map((season) => (
            <Card key={season.id}>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-semibold">{season.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {monthLabel(season.startMonth)} –{" "}
                    {monthLabel(season.endMonth)}
                  </p>
                  {season.description && (
                    <p className="text-sm mt-1">{season.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(season.id);
                      setForm({
                        name: season.name,
                        description: season.description || "",
                        startMonth: String(season.startMonth || 1),
                        endMonth: String(season.endMonth || 12),
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
                      if (confirm(`Delete ${season.name}?`)) {
                        deleteMutation.mutate(season.id);
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
