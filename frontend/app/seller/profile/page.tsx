"use client";

import { useQuery } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";

export default function SellerProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: sellerService.getProfile,
  });

  return (
    <SellerLayout>
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Farmer Profile</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-32" /> : (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {data?.firstName} {data?.lastName}</p>
              <p><span className="font-medium">Email:</span> {data?.email}</p>
              <p><span className="font-medium">Farm:</span> {data?.farmName || "—"}</p>
              <p><span className="font-medium">Phone:</span> {data?.phone || "—"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </SellerLayout>
  );
}
