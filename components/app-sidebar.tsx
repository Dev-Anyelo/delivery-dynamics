"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
// import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import { PackageCheck, Map, RouteIcon } from "lucide-react";

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
      title: "Rutas",
      url: "/routes",
      icon: RouteIcon,
      isActive: true,
      items: [
        {
          title: "Todas las Rutas",
          url: "/routes",
        },
        {
          title: "Agregar nueva Ruta",
          url: "/routes/add-route",
        },
      ],
    },
    {
      title: "Guías",
      url: "/guides",
      icon: Map,
      items: [
        {
          title: "Todas las Guías",
          url: "/guides",
        },
        {
          title: "Agregar nueva Guía",
          url: "/guides/add-guide",
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
