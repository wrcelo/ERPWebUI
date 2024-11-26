import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Box,
	Building2,
	ChartSpline,
	Command,
	Frame,
	GalleryVerticalEnd,
	Hammer,
	HandCoins,
	Home,
	LayoutDashboard,
	Map,
	Menu,
	PieChart,
	Settings2,
	ShoppingCart,
	SquareMenu,
	SquareTerminal,
	Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

const data = {
	user: {
		name: "Marcelo Ramalho",
		email: "marcelomramalho@gmail.com",
		avatar: "https://github.com/wrcelo.png",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: <GalleryVerticalEnd />,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: <AudioWaveform />,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: <Command />,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Painéis",
			url: "#",
			icon: <LayoutDashboard />,
			isActive: true,
			items: [
				{
					title: "Início",
					url: "#",
				},
				{
					title: "Financeiro",
					url: "#",
				},
				{
					title: "Relatórios",
					url: "#",
				},
			],
		},
		{
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
