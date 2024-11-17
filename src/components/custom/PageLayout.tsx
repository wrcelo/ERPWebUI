import { Menu, StickyNote } from "lucide-react";

import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { navMenu } from "@/routes/RootLayout";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";

import { Link } from "react-router-dom";

const PageLayout = ({ children }: { children?: ReactNode }) => {
	const location = useLocation();
	const itemFound = navMenu.find((item) => item.url == location.pathname);
	const displayName = itemFound ? itemFound.name : "Página";
	const icon = itemFound ? itemFound.icon : <StickyNote />;
	const [menuIsOpen, setMenuIsOpen] = useState(false);

	const handleClickMenu = () => {};
	return (
		<>
			<div className="text-lg bg-background">
				<div className="flex gap-2 items-center h-14 p-6 py-8 font-semibold justify-between border-b">
					<div className="flex gap-2 items-center text-foreground">
						{icon}
						<h2>{displayName}</h2>
					</div>

					<Sheet
						onOpenChange={setMenuIsOpen}
						open={menuIsOpen}
					>
						<SheetTrigger asChild>
							<Button
								className="px-[9px] lg:hidden"
								variant={"outline"}
								onClick={handleClickMenu}
							>
								<Menu className="w-4 h-4" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side={"left"}
							className="px-3"
						>
							<div className="h-full">
								{navMenu.map((item, index) => {
									return (
										<Link
											to={item.url}
											key={index}
											onClick={() => {
												setMenuIsOpen(false);
											}}
										>
											<div
												className={`flex gap-2 items-center p-2 px-4 rounded mb-3 ${
													location.pathname == item.url ? "bg-primary-foreground font-semibold" : ""
												}`}
											>
												{item.icon}
												{item.name}
											</div>
										</Link>
									);
								})}
							</div>
							<SheetFooter>
								<SheetDescription className="text-xs text-muted-foreground/60">CMN Sistemas LTDA.</SheetDescription>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</div>
			<div className="p-6 ">{children}</div>
		</>
	);
};

export default PageLayout;
