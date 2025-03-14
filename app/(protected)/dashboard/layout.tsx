"use client";

import Link from "next/link";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/components/AuthContext";
import { SettingsDialog } from "@/components/ui/settings-dialog";
import NotificationDropdown from "@/components/ui/notification-dropdown";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function getBreadcrumbs(path: string) {
    const pathArray = path.split("/").filter(Boolean);
    const items = pathArray.map((segment, index) => {
      const href = "/" + pathArray.slice(0, index + 1).join("/");
      return (
        <BreadcrumbItem key={href}>
          <Link href={href}>{segment}</Link>
        </BreadcrumbItem>
      );
    });

    const breadcrumbs: React.ReactNode[] = [];
    items.forEach((item, index) => {
      breadcrumbs.push(item);
      if (index < items.length - 1) {
        breadcrumbs.push(<BreadcrumbSeparator key={`sep-${index}`} />);
      }
    });
    return breadcrumbs;
  }

  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between items-center pr-8 h-16 sm:h-20 shrink-0 gap-2 transition-[width,height] ease-linear dark:bg-[#0a0908]">
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
          <Toaster
            position="top-center"
            closeButton
            theme="system"
            richColors
          />
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
