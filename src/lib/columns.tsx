import { ColumnDef } from "@tanstack/react-table";
import { Banco, Cor, Cores, Departamento, Empresa, Produto } from "@/lib/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import placeholderImagemEmpresa from "@/assets/placeholder.png";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ColumnsEmpresasProps {
	onEdit: (empresa: Empresa) => void;
	onDelete: (empresa: Empresa) => void;
}
interface ColumnsProdutosProps {
	onEdit: (produto: Produto) => void;
	onDelete: (produto: Produto) => void;
}
interface ColumnsCoresProps {
	onEdit: (cor: Cor) => void;
	onDelete: (cor: Cor) => void;
}

interface ColumnsBancosProps {
	onEdit: (banco: Banco) => void;
	onDelete: (banco: Banco) => void;
}

interface ColumnsDepartamentosProps {
	onEdit: (departamento: Departamento) => void;
	onDelete: (departamento: Departamento) => void;
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
				const navigate = useNavigate();
				return (
					<div onClick={() => navigate("/empresas/" + row.original.id)}>
						<img
							className="w-10 h-10 lg:w-14 lg:h-14 rounded border object-cover"
							src={row.original.nomeImagemFilial ? "https://localhost:5001/imagens/" + row.original.nomeImagemFilial : placeholderImagemEmpresa}
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
				return <Badge>{cnpj}</Badge>;
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const produto = row.original;
				const navigate = useNavigate();
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
							<DropdownMenuLabel>Ações</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onEdit(produto)}>Editar</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete(produto)}>Excluir</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate("/empresas/" + row.original.id)}>Ver Detalhes</DropdownMenuItem>
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
export function ColumnsCores({ onEdit, onDelete }: ColumnsCoresProps) {
	const columns: ColumnDef<Cor>[] = [
		{
			id: "nomeCor",
			accessorKey: "nomeCor",
			header: "Nome",
		},
		{
			id: "codigoCor",
			accessorKey: "codigoCor",
			header: "Código",
		},
		{
			id: "descricaoCor",
			accessorKey: "descricaoCor",
			header: "Descrição",
			cell: ({ row }) => {
				const cor = row.original;
				return <>{cor.descricaoCor || <div className="text-muted-foreground/40">Sem descrição</div>}</>;
			},
		},

		{
			id: "actions",
			cell: ({ row }) => {
				const cor = row.original;
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
							<DropdownMenuLabel>{cor.nomeCor}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onEdit(cor)}>Editar</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete(cor)}>Excluir</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return columns;
}
export function ColumnsBancos({ onEdit, onDelete }: ColumnsBancosProps) {
	const columns: ColumnDef<Banco>[] = [
		{
			id: "nomeBanco",
			accessorKey: "nomeBanco",
			header: "Nome",
		},
		{
			id: "codigoBanco",
			accessorKey: "codigoBanco",
			header: "Código",
		},
		{
			id: "siteBanco",
			accessorKey: "siteBanco",
			header: "Site",
			cell: ({ row }) => {
				const banco = row.original;
				return (
					<a
						href={banco.siteBanco}
						target="_blank"
						rel="noopener noreferrer"
					>
						{banco.siteBanco || <div className="text-muted-foreground/40">-</div>}
					</a>
				);
			},
		},

		{
			id: "actions",
			cell: ({ row }) => {
				const banco = row.original;
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
							<DropdownMenuLabel>{banco.nomeBanco}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onEdit(banco)}>Editar</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete(banco)}>Excluir</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return columns;
}
export const ColumnsDepartamentos = ({ onEdit, onDelete }: ColumnsDepartamentosProps) => {
	const columns: ColumnDef<Departamento>[] = [
		{
			id: "id",
			accessorKey: "idDepartamento",
			header: "ID",
		},
		{
			id: "nome",
			accessorKey: "nomeDepartamento",
			header: "Nome",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const departamento = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-8 w-8 p-0"
							>
								<span className="sr-only">Abrir menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Ações</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onEdit(departamento)}>
								<Edit className="h-4 w-4" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onDelete(departamento)}
								className="text-destructive focus:text-destructive"
							>
								<Trash className="h-4 w-4" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
	return columns;
};
