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

const data = {
  user: {
    name: "Anyelo Benavides",
    email: "anyelobg.dev@gmail.com",
    avatar: "",
  },
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
