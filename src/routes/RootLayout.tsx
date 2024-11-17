import { NavMenuItem } from "@/components/custom/NavMenuItem";
import PageLayout from "@/components/custom/PageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Box, Building2, ChartSpline, Hammer, Home, Plus, ShoppingCart, Users } from "lucide-react";
import { Outlet } from "react-router-dom";

export const navMenu = [
	{
		name: "Produtos",
		icon: <Box className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/produtos",
		submenus: [],
		admin: false,
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
		admin: false,
	},
	{
		name: "Home",
		icon: <Home className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/home",
		submenus: [],
		admin: false,
	},
	{
		name: "Relatórios",
		icon: <ChartSpline className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/relatorios",
		submenus: [],
		admin: true,
	},
	{
		name: "Vendas",
		icon: <ShoppingCart className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/vendas",
		submenus: [],
		admin: false,
	},
	{
		name: "Utilitários",
		icon: <Hammer className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/utilitarios",
		submenus: [],
		admin: true,
	},
	{
		name: "Empresas",
		icon: <Building2 className="w-5 h-5 lg:w-5 lg:h-5" />,
		url: "/empresas",
		submenus: [],
		admin: false,
	},
];
export default function Root() {
	return (
		<>
			<div className="flex flex-col w-screen h-screen lg:flex-row-reverse ">
				<div className="h-full w-full bg-muted-foreground/5">
					<PageLayout>
						<Outlet />
					</PageLayout>
				</div>
				<div className="lg:border-r lg:px-6 hidden lg:block">
					<div className="my-6">
						<div className="p-4 bg-muted-foreground/5 rounded-md flex gap-4 items-center">
							<Avatar>
								<AvatarImage src="https://github.com/wrcelo.png" />
								<AvatarFallback>wr</AvatarFallback>
							</Avatar>
							<div>
								<h6 className="font-semibold text-foreground/80 text-xs">Marcelo Ramalho</h6>
								<span className="text-xs font-semibold text-muted-foreground/80">Admin</span>
							</div>
						</div>
					</div>
					<div className="lg:gap-6 lg:flex lg:flex-col lg:w-[220px]">
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
			</div>
		</>
	);
}
