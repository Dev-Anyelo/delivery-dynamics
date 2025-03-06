"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Bell,
  Settings,
  Rocket,
  UserPlus,
  Globe,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  icon: React.ReactNode;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      title: "Deployment successful",
      description: "Your project 'my-next-app' was deployed to production",
      date: "2 minutes ago",
      read: false,
      icon: <Rocket className="h-5 w-5 text-green-500" />,
    },
    {
      id: "2",
      title: "New team member",
      description: "Sarah Miller joined your team",
      date: "1 hour ago",
      read: false,
      icon: <UserPlus className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "3",
      title: "Domain verified",
      description: "Domain example.com was successfully verified",
      date: "3 hours ago",
      read: true,
      icon: <Globe className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "4",
      title: "Usage limit warning",
      description: "Your project is approaching its usage limit",
      date: "1 day ago",
      read: true,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: "5",
      title: "Build failed",
      description: "Build failed for project 'dashboard-app' - Check logs",
      date: "2 days ago",
      read: true,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
  ]);

  const [open, setOpen] = React.useState(false);

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            <h4 className="text-sm font-semibold">Notificaciones</h4>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="inbox"
              className={cn(
                "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
              )}
            >
              Inbox
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className={cn(
                "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
              )}
            >
              Archivados
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className={cn(
                "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
              )}
            >
              Comentarios
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="p-0">
            {notifications.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full border p-4">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No hay notificaciones
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex w-full items-start space-x-4 p-4 hover:bg-muted/50",
                      !notification.read && "bg-muted/50"
                    )}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {notification.icon}
                    </div>
                    <div className="flex-1 space-y-1 text-left">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.date}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="archive" className="min-h-[300px] p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-sm text-muted-foreground">
                No hay notificaciones archivadas
              </p>
            </div>
          </TabsContent>
          <TabsContent value="comments" className="min-h-[300px] p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-sm text-muted-foreground">
                No hay comentarios
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
