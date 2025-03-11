"use client";

import Link from "next/link";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsDialog } from "@/components/ui/settings-dialog";
import NotificationDropdown from "@/components/ui/notification-dropdown";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  function getPageName(path: string) {
    const pathArray = path.split("/");
    const pageName = pathArray[pathArray.length - 1];
    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
  }

  function getBreadcrumbs(path: string) {
    const pathArray = path.split("/").filter(Boolean);
    return pathArray.map((segment, index) => {
      const href = "/" + pathArray.slice(0, index + 1).join("/");
      return (
        <BreadcrumbItem key={href}>
          <Link href={href}>{segment}</Link>
          {index < pathArray.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      );
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between items-center pr-8 h-16 sm:h-20 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:bg-[#0a0908]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>{getBreadcrumbs(pathname)}</BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-center items-center gap-3">
            <SettingsDialog />
            <NotificationDropdown />
          </div>
        </header>
        <main className="flex-1 overflow-y-hidden dark:bg-[#0a0908] px-6">
          {children}
        </main>
        <Toaster position="top-center" closeButton theme="system" richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}
