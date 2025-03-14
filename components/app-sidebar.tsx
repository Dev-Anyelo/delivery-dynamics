"use client";

import * as React from "react";
import { useAuth } from "./AuthContext";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
// import { NavProjects } from "@/components/nav-projects";
import { PackageCheck, Map, RouteIcon, Users, FileStack } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
      url: "/dashboard/guides",
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
      url: "/dashboard/clients",
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
      url: "/dashboard/users",
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
      url: "/dashboard/reports",
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
