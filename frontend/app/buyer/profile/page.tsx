"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buyerService } from "@/services/buyer.service";
import { useToast } from "@/components/ui/toast-context";

type ProfileForm = {
  name: string;
  phone: string;
  bio: string;
};

type BuyerProfileResponse = {
  bio?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export default function BuyerProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-profile"],
    queryFn: () =>
      buyerService.getProfile() as Promise<BuyerProfileResponse>,
  });

  const { register, handleSubmit, reset } = useForm<ProfileForm>({
    defaultValues: { name: "", phone: "", bio: "" },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      name: data.user?.name || "",
      phone: data.user?.phone || "",
      bio: data.bio || "",
    });
  }, [data, reset]);

  const updateProfile = useMutation({
    mutationFn: (form: ProfileForm) =>
      buyerService.updateProfile({
        name: form.name || undefined,
        phone: form.phone || undefined,
        bio: form.bio || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-profile"] });
      toast({ title: "Profile updated", type: "success" });
    },
    onError: () => toast({ title: "Failed to update profile", type: "error" }),
  });

  if (isLoading) {
    return (
      <BuyerLayout>
        <Skeleton className="h-64 rounded-2xl" />
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((formData) => updateProfile.mutate(formData))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={data?.user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Input {...register("bio")} />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </BuyerLayout>
  );
}
