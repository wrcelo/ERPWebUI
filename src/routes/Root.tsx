import { AppSidebar } from "@/components/ui/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Root() {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);

	const breadcrumbItems = [
		{ name: "Home", path: "/" },
		...pathnames.map((name, index) => ({
			name: name.charAt(0).toUpperCase() + name.slice(1),
			path: "/" + pathnames.slice(0, index + 1).join("/"),
		})),
	];

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full p-6">
				<div className="flex items-center gap-4 pb-6">
					<SidebarTrigger />

					<Breadcrumb>
						<BreadcrumbList>
							{breadcrumbItems.map((item, index) => (
								<React.Fragment key={item.path}>
									<BreadcrumbItem>
										<Link to={item.path}>{item.name}</Link>
									</BreadcrumbItem>
									{index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
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
