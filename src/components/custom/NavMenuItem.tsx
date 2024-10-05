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
			} col-span-1 flex flex-col items-center text-xs lg:flex-row lg:gap-2 lg:text-sm lg:px-3 lg:py-2 lg:rounded lg:border-muted lg:w-full lg:hover:bg-muted-foreground/5 transition-all ${
				location.pathname == url ? "lg:bg-muted-foreground/5 " : "font-normal text-muted-foreground/60 lg:text-muted-foreground"
			}`}
		>
			{icon}
			{name}
		</Link>
	);
};
