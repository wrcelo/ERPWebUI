import { ColumnDef } from "@tanstack/react-table";
import { Empresa, Produto } from "@/lib/types";
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
}
interface ColumnsProdutosProps {
	onEdit: (produto: Produto) => void;
	onDelete: (produto: Produto) => void;
}

export function ColumnsEmpresas({ onEdit, onDelete }: ColumnsEmpresasProps) {
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

export function ColumnsProdutos({ onEdit, onDelete }: ColumnsProdutosProps) {
	const columns: ColumnDef<Produto>[] = [
		{
			id: "nome",
			accessorKey: "nome",
			header: "Nome",
		},
		{
			id: "descricao",
			accessorKey: "descricao",
			header: "Descrição",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const produto = row.original;
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
							<DropdownMenuLabel>{produto.nome}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onEdit(produto)}>Editar</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete(produto)}>Excluir</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return columns;
}
