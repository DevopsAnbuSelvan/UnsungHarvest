"use client";

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

export default function BuyerProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-profile"],
    queryFn: buyerService.getProfile,
  });

  const { register, handleSubmit, reset } = useForm();

  const updateProfile = useMutation({
    mutationFn: buyerService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-profile"] });
      toast({ title: "Profile updated", type: "success" });
    },
  });

  if (isLoading) return <BuyerLayout><Skeleton className="h-64 rounded-2xl" /></BuyerLayout>;

  return (
    <BuyerLayout>
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((formData) => updateProfile.mutate(formData))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input defaultValue={data?.firstName} {...register("firstName")} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input defaultValue={data?.lastName} {...register("lastName")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={data?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue={data?.phone} {...register("phone")} />
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
