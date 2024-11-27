import { ColumnDef } from "@tanstack/react-table";
import { Cores, Empresa, Produto } from "@/lib/types";
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
import placeholderImagemEmpresa from "@/assets/placeholder.png";

interface ColumnsEmpresasProps {
	onEdit: (empresa: Empresa) => void;
	onDelete: (empresa: Empresa) => void;
}
interface ColumnsProdutosProps {
	onEdit: (produto: Produto) => void;
	onDelete: (produto: Produto) => void;
}

// export function ColumnsEmpresas({ onEdit, onDelete }: ColumnsEmpresasProps) {
//   const columns: ColumnDef<Empresa>[] = [
//     {
//       id: "nome",
//       accessorKey: "nome",
//       header: "Nome",
//     },
//     {
//       id: "cnpj",
//       accessorKey: "cnpj",
//       header: "CNPJ",
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const empresa = row.original;
//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Abrir</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>{empresa.nome}</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => onEdit(empresa)}>
//                 Editar
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => onDelete(empresa)}>
//                 Excluir
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];

//   return columns;
// }

export function ColumnsEmpresas({ onEdit, onDelete }: ColumnsEmpresasProps) {
	const columns: ColumnDef<Empresa>[] = [
		{
			id: "imgUrl",
			accessorKey: "imgUrl",
			header: ({}) => {
				return <div>Imagem</div>;
			},

			cell: ({ row }) => {
				return (
					<div>
						<img
							className="w-10 h-10 lg:w-14 lg:h-14 rounded border object-cover"
							src={row.original.imgUrl ?? placeholderImagemEmpresa}
						/>
					</div>
				);
			},
		},
		{
			id: "nome",
			accessorKey: "nome",
			header: "Nome",
			cell: ({ row }) => {
				const nome = row.original.nome;
				return <div className="text-ellipsis line-clamp-1 min-w-32">{nome}</div>;
			},
		},
		{
			id: "cnpj",
			accessorKey: "cnpj",
			header: "CNPJ",
			cell: ({ row }) => {
				const cnpj = row.original.cnpj;
				return <div className="text-ellipsis line-clamp-1">{cnpj}</div>;
			},
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

export function ColumnsProdutos({ onEdit, onDelete }: ColumnsProdutosProps) {
	const columns: ColumnDef<Produto>[] = [
		{
			id: "imgUrl",
			accessorKey: "imgUrl",
			header: "Imagem",
			cell: ({ row }) => {
				return (
					<div className="">
						<img
							className="w-16 h-16 rounded border object-cover"
							src={row.original.imgUrl}
						/>
					</div>
				);
			},
		},
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
			id: "estoqueEmMetros",
			accessorKey: "estoqueEmMetros",
			header: "Estoque",
		},

		{
			id: "cores",
			accessorKey: "cores",
			header: "Cores",
			cell: ({ row }) => {
				return (
					<div className="flex gap-1">
						{row.original.cores?.map((cor: Cores) => {
							return (
								<div
									key={cor.descricaoCor}
									style={{ backgroundColor: cor.hexadecimalCor }}
									className="w-4 h-4 border rounded"
								></div>
							);
						})}
					</div>
				);
			},
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
