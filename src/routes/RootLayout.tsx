import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SeparatorVertical } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Root() {
  const location = useLocation();

  // Divide o pathname em partes
  const pathnames = location.pathname.split("/").filter((x) => x); // Remove qualquer parte vazia

  // Define os links do breadcrumb
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    ...pathnames.map((name, index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitaliza a primeira letra
      path: "/" + pathnames.slice(0, index + 1).join("/"),
    })),
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-6">
        <div className="flex items-center gap-2 pb-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <BreadcrumbItem>
                    <Link to={item.path}>{item.name}</Link>
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
