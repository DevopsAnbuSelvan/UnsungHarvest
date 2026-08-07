"use client";

import { SellerLayout } from "@/components/layout/seller-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerSettingsPage() {
  return (
    <SellerLayout>
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Manage your seller account settings, notification preferences, and payout details.
          </p>
        </CardContent>
      </Card>
    </SellerLayout>
  );
}
