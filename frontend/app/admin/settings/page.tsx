"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <Card>
          <CardHeader>
            <CardTitle>Platform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Default student commission is <strong>5%</strong> (set per seller
              under Manage Sellers).
            </p>
            <p>
              Auth is handled by Firebase. App data lives in Neon Postgres.
            </p>
            <p>
              Use Super Cold Admin → Manage Admins to add or remove Admin
              accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
