"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Bell, Globe } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    marketing: false,
  });

  return (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <Card className="border-none">
        <CardHeader>
          <CardTitle>
            Configuración de notificaciones{" "}
            <Badge className="text-emerald-400 bg-emerald-900/70 dark:bg-emerald-900/50 w-fit ml-1 h-5">
              Próximamente
            </Badge>
          </CardTitle>
          <CardDescription>
            Elija cómo desea recibir diferentes tipos de notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              title: "Correo electrónico",
              description: "Reciba notificaciones por correo electrónico",
              icon: Mail,
              key: "email",
            },
            {
              title: "Notificaciones push",
              description: "Reciba notificaciones push en su dispositivo",
              icon: Bell,
              key: "push",
            },
            {
              title: "Actualizaciones",
              description:
                "Reciba actualizaciones de acciones realizadas en la plataforma",
              icon: Globe,
              key: "updates",
            },
          ].map(({ title, description, icon: Icon, key }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <Label>{title}</Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <Switch
                disabled
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
