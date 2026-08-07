"use client";

import { BuyerLayout } from "@/components/layout/buyer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function BuyerSettingsPage() {
  return (
    <BuyerLayout>
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive order updates via email</p>
            <Button variant="outline" size="sm">Enabled</Button>
          </div>
          <div className="space-y-2">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Get notified about deals and offers</p>
            <Button variant="outline" size="sm">Enabled</Button>
          </div>
        </CardContent>
      </Card>
    </BuyerLayout>
  );
}
