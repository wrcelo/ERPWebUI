import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cliente } from "@/lib/types";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, XCircle } from "lucide-react";

const Clientes = () => {
	const dadosClientes: Cliente[] = [
		// {
		// 	id: "1",
		// 	nome: "Farm Rio",
		// 	imgUrl: "https://riomarca-miami.s3.amazonaws.com/2023/10/logo-farm.jpg",
		// 	descricao: "Empresa de vestuário do Rio de Janeiro",
		// },
		// {
		// 	id: "2",
		// 	nome: "Empório dos Tecidos",
		// 	imgUrl:
		// 		"https://img.freepik.com/vetores-premium/fios-de-fibra-tecidos-juntos-fibras-de-roupas-em-varias-cores-detalhes-de-um-tecido-ou-modelo-de-logotipo-de-modelo-vetorial-de-tecido_100655-2775.jpg?semt=ais_hybrid",
		// 	descricao: "Empresa de tecidos de Minas Gerais",
		// },
	];

	const columns: ColumnDef<Cliente>[] = [
		{
			id: "imgUrl",
			accessorKey: "imgUrl",
			header: "Imagem",
			cell: ({ row }) => (
				<div>
					<img
						className="w-10 h-10 lg:w-14 lg:h-14 rounded border object-cover"
						src={row.original.imgUrl}
					/>
				</div>
			),
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
							<DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
							<DropdownMenuItem onClick={() => {}}>Excluir</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: dadosClientes,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<>
			<div className="mb-6 flex gap-2 justify-between">
				<div className="flex gap-2">
					<Button
						onClick={() => {}}
						className="gap-2"
					>
						<Plus className="w-4 h-4" />
						<div className="hidden lg:block ">Adicionar Cliente</div>
					</Button>
					{/* <Button
						className="gap-1"
						variant={"outline"}
					>
						<ListFilter className="w-4 h-4" />
						<div className="hidden lg:block">Filtrar</div>
					</Button> */}
				</div>
				<div>
					<div className="flex w-full max-w-sm items-center space-x-2">
						<Input
							type="text"
							placeholder="Buscar..."
							onInput={() => {}}
						/>
					</div>
				</div>
			</div>
			<div>
				<div className="rounded">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												className={`py-3 text-xs lg:text-sm lg:py-4 ${cell.column.columnDef.id === "actions" ? "min-w-[40px]" : ""} ${
													cell.column.columnDef.id === "nome" ? "font-semibold text-foreground/80" : ""
												}`}
												key={cell.id}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										<div className="flex gap-2 justify-center items-center font-semibold text-muted-foreground text-xs">
											<XCircle className="w-3 h-3" />
											Não foi encontrado nenhum dado
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					<div className="flex items-center justify-end space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="w-4 h-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Clientes;
