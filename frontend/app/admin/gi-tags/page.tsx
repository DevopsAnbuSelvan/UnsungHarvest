"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/admin.service";

export default function GiTagsPage() {
  const { data } = useQuery({
    queryKey: ["admin-gi-tags"],
    queryFn: adminService.getGiTags,
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">GI Tag Database</h2>
      <div className="space-y-4">
        {data?.map((tag) => (
          <Card key={tag.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{tag.productName}</p>
                <p className="text-sm text-muted-foreground">{tag.region}</p>
              </div>
              <Badge variant="gi">{tag.tagNumber}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
