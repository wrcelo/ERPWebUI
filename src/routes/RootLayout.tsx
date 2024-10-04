import { Box, Building2, ChartSpline, Hammer, Home, Plus, ShoppingCart, Users } from "lucide-react";
import { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Root() {
	const navMenu = [
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

	const NavMenuItem = ({ name, url, icon, index }: { name: string; url: string; icon: ReactNode; index: number }) => {
		return (
			<Link
				to={url}
				key={name}
				className={`${
					index >= 5 ? "hidden lg:flex" : ""
				} col-span-1 flex flex-col items-center text-xs lg:flex-row lg:gap-2 lg:text-sm lg:px-3 lg:py-2 lg:rounded-md lg:border-muted lg:w-full lg:hover:bg-muted-foreground/15 transition-all ${
					location.pathname == url ? "lg:bg-muted-foreground/15 " : "font-normal lg:text-muted-foreground"
				}`}
			>
				{icon}
				{name}
			</Link>
		);
	};

	let location = useLocation();

	return (
		<>
			<div className="flex flex-col w-screen h-screen lg:flex-row-reverse ">
				<div className="h-full w-full">
					<Outlet />
				</div>
				<div className="w-full border-t h-20 grid grid-cols-5 items-center px-6 lg:w-[320px] lg:flex lg:flex-col lg:items-start lg:p-2 lg:border-r lg:h-full lg:gap-1">
					{navMenu.map((item, index) => {
						return (
							<NavMenuItem
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
