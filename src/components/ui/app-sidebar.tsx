import * as React from "react";
import { HammerIcon, HandCoins, LayoutDashboard, Menu } from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

const data = {
	user: {
		name: "Marcelo Ramalho",
		email: "marcelomramalho@gmail.com",
		avatar: "https://github.com/wrcelo.png",
	},
	navMain: [
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
				{
					title: "Bancos",
					url: "/bancos",
				},
				{
					title: "Departamentos",
					url: "/departamentos",
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
