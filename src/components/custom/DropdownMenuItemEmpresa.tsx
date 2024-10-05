import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Empresa } from "@/lib/types";

const DropdownMenuItemEmpresa = ({ empresa, handleEdit }: { empresa: Empresa; handleEdit: (isOpen: boolean) => {} }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-8 w-8 p-0"
				>
					<span className="sr-only">Abrir</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{empresa.nome}</DropdownMenuLabel>

				<DropdownMenuSeparator />
				<DropdownMenuItem>Detalhes</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						handleEdit(true);
					}}
				>
					Editar
				</DropdownMenuItem>
				<DropdownMenuItem>Excluir</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default DropdownMenuItemEmpresa;
