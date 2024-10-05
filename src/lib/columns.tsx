import { ColumnDef } from "@tanstack/react-table";
import { Empresa } from "@/lib/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface ColumnsEmpresasProps {
	onEdit: (empresa: Empresa) => void;
	onDelete: (empresa: Empresa) => void;
	onDetalhes: (empresa: Empresa) => void;
}

export function ColumnsEmpresas({ onEdit, onDelete, onDetalhes }: ColumnsEmpresasProps) {
	const columns: ColumnDef<Empresa>[] = [
		{
			id: "nome",
			accessorKey: "nome",
			header: "Nome",
		},
		{
			id: "cnpj",
			accessorKey: "cnpj",
			header: "CNPJ",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const empresa = row.original;
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
							<DropdownMenuItem onClick={() => onDetalhes(empresa)}>Detalhes</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onEdit(empresa)}>Editar</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete(empresa)}>Excluir</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return columns;
}
