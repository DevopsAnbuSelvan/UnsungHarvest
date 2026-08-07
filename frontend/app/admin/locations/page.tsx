"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function LocationsPage() {
  const { data } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: adminService.getLocations,
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Locations</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((loc) => (
          <Card key={loc.id}>
            <CardContent className="p-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold">{loc.name}</p>
                <p className="text-sm text-muted-foreground">
                  {loc.district ? `${loc.district}, ` : ""}{loc.state}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
