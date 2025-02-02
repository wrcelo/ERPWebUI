import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Produto } from "@/lib/types";
import { Separator } from "../ui/separator";

interface DataTableProps<Produto, TValue> {
	columns: ColumnDef<Produto, TValue>[];
	data: Produto[];
}

export function DataTableProdutos<T, TValue>({ columns, data }: DataTableProps<Produto, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const navigate = useNavigate();
	return (
		<>
			<div className="rounded hidden md:block">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											className={``}
											key={header.id}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
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
											className={`py-3 text-xs lg:text-sm lg:py-4  ${cell.column.columnDef.id == "actions" ? "w-0" : ""} ${
												cell.column.columnDef.id == "nome" ? "font-semibold text-foreground/80" : ""
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
				<div className="flex items-center justify-end space-x-2 ">
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
			<div className="grid grid-cols-2 gap-2 md:hidden">
				{table.getRowModel().rows.map((item) => {
					const produto = item.original;
					return (
						<Card
							className="col-span-2 sm:col-span-1"
							onClick={() => {
								navigate("/produtos/" + produto.id);
							}}
						>
							<CardHeader className="pb-3">
								<div className="flex w-full justify-between items-center">
									<div className="font-bold text-lg">{produto.nome || "Produto sem nome"}</div>
									<div className="text-xs text-muted-foreground">ID: {produto.id}</div>
								</div>
							</CardHeader>
							<CardContent>
								{produto.imgUrl && (
									<div className="mb-4 w-full flex gap-4">
										<img
											src={produto.imgUrl}
											alt={produto.nome || "Imagem do produto"}
											className="rounded-md object-cover aspect-square w-12"
										/>
										<p className="text-muted-foreground text-xs line-clamp-3">{produto.descricao || "Sem descrição disponível"}</p>
									</div>
								)}
								<Separator className="my-4" />
								{/* <div className="text-xs mb-2 font-semibold">Cores disponíveis</div> */}
								{produto.cores && produto.cores.length > 0 && (
									<div className="flex space-x-2">
										{produto.cores.map((cor) => (
											<div
												key={cor.descricaoCor}
												className="flex items-center space-x-1"
											>
												<div
													className="w-3 h-3 rounded-full border"
													style={{ backgroundColor: cor.hexadecimalCor }}
												/>
												<span className="text-xs text-muted-foreground">{cor.descricaoCor}</span>
											</div>
										))}
									</div>
								)}
								<div className="flex justify-between items-center mt-4">
									<span className="text-sm text-muted-foreground">Estoque</span>
									<div className="border-b w-[calc(100%-125px)] h-1"></div>
									<span className="text-lg text-muted-foreground">{produto.estoqueEmMetros}m</span>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</>
	);
}
