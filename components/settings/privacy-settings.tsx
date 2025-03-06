"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    twoFactor: false,
    dataSharing: true,
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
            Configuración de Privacidad
            <Badge className="text-emerald-400 bg-emerald-900/70 dark:bg-emerald-900/50 w-fit ml-1 h-5">
              Próximamente
            </Badge>
          </CardTitle>
          <CardDescription>
            Personaliza la privacidad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Verificación de dos pasos</Label>
              <p className="text-sm text-muted-foreground max-w-xl text-balance">
                Añade una capa extra de seguridad a tu cuenta. Recibirás un
                código de verificación en tu correo electrónico para iniciar
                sesión en tu cuenta.
              </p>
            </div>
            <Switch
              disabled
              checked={privacy.twoFactor}
              onCheckedChange={(checked) =>
                setPrivacy((prev) => ({ ...prev, twoFactor: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
