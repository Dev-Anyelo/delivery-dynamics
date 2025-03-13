"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
// import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import { PackageCheck, Map, RouteIcon, Users, FileStack } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "./AuthContext";

const data = {
  teams: [
    {
      name: "Delivery Dynamics",
      logo: PackageCheck,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Guías",
      url: "/guides",
      icon: Map,
      items: [
        {
          title: "Gestionar guías",
          url: "/guides",
        },
      ],
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: RouteIcon,
      items: [
        {
          title: "Gestionar clientes",
          url: "/clients",
        },
      ],
    },
    {
      title: "Usuarios",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Gestionar usuarios",
          url: "/users",
        },
      ],
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: FileStack,
      items: [
        {
          title: "Generar reportes",
          url: "/reports",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
