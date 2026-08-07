"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Admin Settings</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Platform configuration, commission rates, and system preferences.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
