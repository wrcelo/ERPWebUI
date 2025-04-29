import * as React from "react";
import { HammerIcon, HandCoins, LayoutDashboard, Menu, User, ShoppingCart, Package, BarChart, ListChecks } from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth-components/AuthProvider";
import { ScrollArea } from "./scroll-area";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// Obtém o usuário autenticado do contexto de autenticação
	const { user } = useAuth();

	// Define a primeira letra do email como avatar fallback
	const getInitials = (email: string = "") => {
		return email.substring(0, 2).toUpperCase();
	};

	// Estrutura de dados do menu
	const navMainItems = [
		{
			isActive: false,
			title: "Configurações",
			url: "/configuracoes",
			icon: <HammerIcon />,
			items: [
				{
					title: "Dados Empresa",
					url: "/dados-empresa",
				},
				{
					title: "Departamentos Produtos",
					url: "/departamentos-produtos",
				},
				{
					title: "Seções Produtos",
					url: "/secoes-produtos",
				},
				{
					title: "Permissões de Acesso",
					url: "/permissoes",
				},
			],
		},
		{
			title: "Cadastros",
			url: "/cadastros",
			icon: <User />,
			isActive: false,
			items: [
				{
					title: "Fornecedores",
					url: "/fornecedores",
				},
				{
					title: "Clientes",
					url: "/clientes",
				},
				{
					title: "Funcionários",
					url: "/funcionarios",
				},
				{
					title: "Usuários",
					url: "/usuarios",
				},
				{
					title: "Transportadoras",
					url: "/transportadoras",
				},
			],
		},
		{
			isActive: false,
			title: "Venda",
			url: "/venda",
			icon: <ShoppingCart />,
			items: [
				{
					title: "Orçamentos",
					url: "/orcamentos",
				},
				{
					title: "Notas Fiscais",
					url: "/notas-fiscais",
				},
			],
		},
		{
			isActive: false,
			title: "Financeiro",
			url: "/financeiro",
			icon: <HandCoins />,
			items: [
				{
					title: "Contas a Receber",
					url: "/contas-receber",
				},
				{
					title: "Contas a Pagar",
					url: "/contas-pagar",
				},
				{
					title: "Entrada de NF",
					url: "/entrada-nf",
				},
				{
					title: "Remessa Banco",
					url: "/remessa-banco",
				},
				{
					title: "Retorno Banco",
					url: "/retorno-banco",
				},
				{
					title: "Pedidos de Compra",
					url: "/pedidos-compra",
				},
				{
					title: "SPED Fiscal",
					url: "/sped-fiscal",
				},
			],
		},
		{
			isActive: false,
			title: "Produtos",
			url: "/produtos-gestao",
			icon: <Package />,
			items: [
				{
					title: "Produtos",
					url: "/produtos",
				},
				{
					title: "Lista de Peças",
					url: "/lista-pecas",
				},
				{
					title: "Entrada de Peças",
					url: "/entrada-pecas",
				},
				{
					title: "Cores e Variantes",
					url: "/cores",
				},
			],
		},
		{
			isActive: false,
			title: "Relatórios",
			url: "/relatorios",
			icon: <BarChart />,
			items: [
				{
					title: "Faturamento Geral",
					url: "/relatorios/faturamento-geral",
				},
				{
					title: "Estoque",
					url: "/relatorios/estoque",
				},
				{
					title: "Faturamento por Vendedor",
					url: "/relatorios/faturamento-vendedor",
				},
				{
					title: "Comissão por Vendedor",
					url: "/relatorios/comissao-vendedor",
				},
				{
					title: "Venda por Produto",
					url: "/relatorios/venda-produto",
				},
				{
					title: "Peças Pequenas",
					url: "/relatorios/pecas-pequenas",
				},
			],
		},
		{
			isActive: false,
			title: "Tabelas/Listas",
			url: "/tabelas",
			icon: <ListChecks />,
			items: [
				{
					title: "CFOP",
					url: "/cfop",
				},
				{
					title: "Unidade de Produtos",
					url: "/unidades",
				},
				{
					title: "Bancos",
					url: "/bancos",
				},
				{
					title: "Comissões",
					url: "/comissoes",
				},
				{
					title: "Instrução de Lavagem",
					url: "/instrucao-lavagem",
				},
				{
					title: "Motivo de Bloqueio",
					url: "/motivo-bloqueio",
				},
				{
					title: "Motivo de Cancelamento",
					url: "/motivo-cancelamento",
				},
				{
					title: "Cargos",
					url: "/cargos",
				},
				{
					title: "Lista de CFOP",
					url: "/lista-cfop",
				},
				{
					title: "Segmento do Cliente",
					url: "/segmento-cliente",
				},
			],
		},
	];

	// Se o usuário não estiver logado, exibe um avatar genérico
	const userData = user
		? {
				name: user.email?.split("@")[0] || "Usuário",
				email: user.email || "usuário@exemplo.com",
				// Gera uma URL de avatar com as iniciais do email
				avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || "U")}&background=random`,
				initials: getInitials(user.email),
		  }
		: {
				name: "Usuário",
				email: "usuário@exemplo.com",
				avatar: "",
				initials: "US",
		  };

	return (
		<Sidebar
			collapsible="icon"
			{...props}
		>
			<SidebarHeader></SidebarHeader>
			<SidebarContent>
				<ScrollArea className="h-full">
					<NavMain items={navMainItems} />
				</ScrollArea>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
