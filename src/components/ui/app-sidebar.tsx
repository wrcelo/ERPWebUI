import * as React from "react";
import { HammerIcon, HandCoins, LayoutDashboard, Menu } from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { Button } from "./button";

const data = {
	user: {
		name: "Marcelo Ramalho",
		email: "marcelomramalho@gmail.com",
		avatar: "https://github.com/wrcelo.png",
	},
	navMain: [
		{
			title: "Painéis",
			url: "#",
			icon: <LayoutDashboard />,
			isActive: false,
			items: [
				{
					title: "Relatórios",
					url: "/relatorios",
				},
			],
		},
		{
			isActive: true,
			title: "Menu",
			url: "/ajustes",
			icon: <Menu />,
			items: [
				{
					title: "Clientes",
					url: "clientes",
				},
				{
					title: "Empresas",
					url: "empresas",
				},
				{
					title: "Produtos",
					url: "produtos",
				},
				{
					title: "Fornecedores",
					url: "fornecedores",
				},
				{
					title: "Representantes",
					url: "representantes",
				},
			],
		},
		{
			isActive: false,
			title: "Financeiro",
			url: "#",
			icon: <HandCoins />,
			items: [
				{
					title: "Compras",
					url: "#",
				},
				{
					title: "Vendas",
					url: "#",
				},
				{
					title: "Contas",
					url: "#",
				},
			],
		},
		{
			isActive: false,
			title: "Utilitários",
			url: "#",
			icon: <HammerIcon />,
			items: [
				{
					title: "Cores",
					url: "/cores",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			{...props}
		>
			<SidebarHeader></SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
