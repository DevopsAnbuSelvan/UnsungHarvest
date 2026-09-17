"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin";
import type { Location } from "@/types/product";
import { useToast } from "@/components/ui/toast-context";

type FormState = {
  name: string;
  region: string;
  state: string;
  country: string;
  description: string;
};

const empty: FormState = {
  name: "",
  region: "",
  state: "",
  country: "India",
  description: "",
};

export default function LocationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: adminService.getLocations,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-locations"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        region: form.region || undefined,
        state: form.state || undefined,
        country: form.country || undefined,
        description: form.description || undefined,
      };
      if (editingId) {
        return adminService.updateLocation({ id: editingId, ...payload });
      }
      return adminService.createLocation(payload);
    },
    onSuccess: () => {
      invalidate();
      toast({
        title: editingId ? "Location updated" : "Location created",
        type: "success",
      });
      setForm(empty);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save location";
      toast({ title: String(message), type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteLocation(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Location deleted", type: "success" });
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
          <h2 className="text-2xl font-bold">Locations</h2>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(empty);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Location" : "New Location"}
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
                    <Label>Region / District</Label>
                    <Input
                      value={form.region}
                      onChange={(e) => setField("region", e.target.value)}
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
                    <Label>Country</Label>
                    <Input
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
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
          {data.map((loc) => {
            const raw = loc as Location & { region?: string };
            return (
              <Card key={loc.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">{loc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {[raw.region || loc.district, loc.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(loc.id);
                        setForm({
                          name: loc.name,
                          region: raw.region || loc.district || "",
                          state: loc.state || "",
                          country: "India",
                          description: "",
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
                        if (confirm(`Delete ${loc.name}?`)) {
                          deleteMutation.mutate(loc.id);
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
