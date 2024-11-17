import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export const NavMenuItem = ({ name, url, icon, index }: { name: string; url: string; icon: ReactNode; index: number }) => {
	let location = useLocation();
	return (
		<Link
			to={url}
			key={name}
			className={`${
				index >= 5 ? "hidden lg:flex" : ""
			} col-span-1 flex flex-col items-center text-xs lg:flex-row lg:gap-3 lg:text-sm lg:rounded lg:border-muted lg:w-full lg:hover:text-foreground transition-all font-semibold ${
				location.pathname == url ? "text-foreground" : "font-normal text-primary-foreground lg:text-muted-foreground lg:font-normal"
			}`}
		>
			{icon}
			{name}
		</Link>
	);
};
