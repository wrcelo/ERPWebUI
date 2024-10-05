import { NavMenuItem } from "@/components/custom/NavMenuItem";
import PageLayout from "@/components/custom/PageLayout";
import { Box, Building2, ChartSpline, Hammer, Home, Plus, ShoppingCart, Users } from "lucide-react";
import { Outlet } from "react-router-dom";

export const navMenu = [
	{
		name: "Produtos",
		icon: <Box className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/produtos",
		submenus: [],
	},
	{
		name: "Clientes",
		icon: <Users className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/clientes",
		submenus: [
			{
				name: "Cadastro",
				icon: <Plus />,
				url: "/clientes/cadastro",
			},
		],
	},
	{
		name: "Home",
		icon: <Home className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/home",
		submenus: [],
	},
	{
		name: "Relatórios",
		icon: <ChartSpline className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/relatorios",
		submenus: [],
	},
	{
		name: "Vendas",
		icon: <ShoppingCart className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/vendas",
		submenus: [],
	},
	{
		name: "Utilitários",
		icon: <Hammer className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/utilitarios",
		submenus: [],
	},
	{
		name: "Empresas",
		icon: <Building2 className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/empresas",
		submenus: [],
	},
];
export default function Root() {
	return (
		<>
			<div className="flex flex-col w-screen h-screen lg:flex-row-reverse ">
				<div className="h-full w-full lg:w-[calc(100vw-320px)] bg-primary-foreground/50">
					<PageLayout>
						<Outlet />
					</PageLayout>
				</div>
				<div className="w-full border-t h-20 grid grid-cols-5 items-center px-6 lg:w-[320px] lg:flex lg:flex-col lg:items-start lg:p-4 lg:border-r lg:h-full lg:gap-2 ">
					{navMenu.map((item, index) => {
						return (
							<NavMenuItem
								key={index}
								name={item.name}
								url={item.url}
								icon={item.icon}
								index={index}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
}
