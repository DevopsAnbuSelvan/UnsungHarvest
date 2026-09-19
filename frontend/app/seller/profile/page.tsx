"use client";

import { useQuery } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";

type SellerProfileResponse = {
  businessName?: string;
  businessDescription?: string;
  phone?: string;
  status?: string;
  commissionPercent?: number | string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export default function SellerProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: () =>
      sellerService.getProfile() as Promise<SellerProfileResponse>,
  });

  return (
    <SellerLayout>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Seller Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {data?.user?.name || "—"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {data?.user?.email || "—"}
              </p>
              <p>
                <span className="font-medium">Business:</span>{" "}
                {data?.businessName || "—"}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {data?.user?.phone || data?.phone || "—"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {data?.status || "—"}
              </p>
              <p>
                <span className="font-medium">Commission:</span>{" "}
                {data?.commissionPercent != null
                  ? `${data.commissionPercent}%`
                  : "—"}
              </p>
              {data?.businessDescription ? (
                <p>
                  <span className="font-medium">About:</span>{" "}
                  {data.businessDescription}
                </p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </SellerLayout>
  );
}
