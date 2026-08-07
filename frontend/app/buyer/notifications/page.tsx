"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationService } from "@/services/notification.service";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getAll,
  });

  const markAllRead = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <BuyerLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
          Mark all read
        </Button>
      </div>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
      <div className="space-y-3">
        {data?.map((n) => (
          <Card key={n.id} className={!n.isRead ? "border-primary/50" : ""}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(n.createdAt)}</p>
              </div>
              {!n.isRead && <Badge>New</Badge>}
            </CardContent>
          </Card>
        ))}
        {!isLoading && !data?.length && (
          <p className="text-center text-muted-foreground py-12">No notifications</p>
        )}
      </div>
    </BuyerLayout>
  );
}
