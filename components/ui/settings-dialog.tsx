"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserManagement } from "../settings/user-management";
import { AccountSettings } from "../settings/account-settings";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { PrivacySettings } from "../settings/privacy-settings";
import { AppearanceSettings } from "../settings/appearance-settings";
import { NotificationSettings } from "../settings/notification-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  User,
  Bell,
  Users,
  Palette,
  LogOut,
  LockKeyhole,
  Loader,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const tabItems = [
  {
    value: "account",
    label: "Cuenta",
    icon: User,
    component: AccountSettings,
  },
  {
    value: "notifications",
    label: "Notificaciones",
    icon: Bell,
    component: NotificationSettings,
  },
  {
    value: "privacy",
    label: "Privacidad",
    icon: LockKeyhole,
    component: PrivacySettings,
  },
  { value: "users", label: "Usuarios", icon: Users, component: UserManagement },
  {
    value: "appearance",
    label: "Apariencia",
    icon: Palette,
    component: AppearanceSettings,
  },
];

export function SettingsDialog() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      toast.warning("Sesión cerrada correctamente");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Avatar
        className="size-8 rounded-lg cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <AvatarImage
          src="/yo.jpg"
          alt={user?.name}
          className="rounded-lg w-full h-full object-cover"
        />
        {user ? (
          <AvatarFallback className="text-blue-600 bg-blue-200 dark:text-blue-400 dark:bg-blue-900/30 hover:bg-blue-300 dark:hover:bg-blue-900/40">
            {user.name[0].toUpperCase()}
          </AvatarFallback>
        ) : (
          <AvatarFallback className="text-blue-600 bg-blue-200 dark:text-blue-400 dark:bg-blue-900/30 hover:bg-blue-300 dark:hover:bg-blue-900/40">
            <Loader className="size-4 animate-spin" />
          </AvatarFallback>
        )}
      </Avatar>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <Tabs
            defaultValue="account"
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Dialog Header: título oculto y navegación de tabs */}
            <DialogHeader className="px-6 py-4">
              <div className="flex items-center justify-center w-full">
                <DialogTitle aria-hidden className="hidden">
                  Settings
                </DialogTitle>

                {/* Tabs de navegación */}
                <TabsList className="flex space-x-2 bg-transparent">
                  {tabItems.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2
                             hover:text-blue-600 dark:hover:text-blue-400
                             hover:bg-blue-100 dark:hover:bg-blue-900/30
                             data-[state=active]:text-blue-600 data-[state=active]:bg-blue-100
                             dark:data-[state=active]:text-blue-400 dark:data-[state=active]:bg-blue-900/30"
                    >
                      <Icon className="size-4" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </DialogHeader>

            {/* Contenido de los Tabs */}
            <div className="flex-1 overflow-y-auto">
              {tabItems.map(({ value, component: Component }) => (
                <TabsContent key={value} value={value}>
                  <Component />
                </TabsContent>
              ))}
            </div>
          </Tabs>

          <div className="flex items-center justify-between px-6 py-4 border-t dark:border-gray-700">
            <Button
              size="sm"
              variant="destructive"
              className="space-x-2"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="size-4 animate-spin" />
                </>
              ) : (
                <>
                  <LogOut className="size-4" />
                  Cerrar sesión
                </>
              )}
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
