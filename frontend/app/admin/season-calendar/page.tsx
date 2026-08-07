"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { adminService } from "@/services/admin.service";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function SeasonCalendarPage() {
  const { data } = useQuery({
    queryKey: ["admin-season-calendar"],
    queryFn: adminService.getSeasonCalendar,
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Season Calendar</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="p-4">
              <p className="font-semibold">{entry.productName}</p>
              <p className="text-sm text-muted-foreground">
                {MONTHS[entry.month - 1]} {entry.region && `• ${entry.region}`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
