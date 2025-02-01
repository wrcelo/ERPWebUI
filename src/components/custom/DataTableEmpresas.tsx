import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, LoaderCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Empresa } from "@/lib/types";
import { Badge } from "../ui/badge";
import placeholder from "@/assets/placeholder.png";
import { useNavigate } from "react-router-dom";

interface DataTableProps<Empresa, TValue> {
	columns: ColumnDef<Empresa, TValue>[];
	data: Empresa[];
}

export function DataTableEmpresas<T, TValue>({ columns, data }: DataTableProps<Empresa, TValue>) {
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
											className={`py-3 text-xs lg:text-sm lg:py-4 ${cell.column.columnDef.id == "actions" ? "w-0" : ""} ${
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
				<div className="flex items-center justify-end space-x-2 mt-4">
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
			<div className="flex flex-col gap-2 md:hidden">
				{table.getRowModel().rows.map((item) => {
					const empresa = item.original;
					console.log(empresa);
					return (
						<Card
							key={empresa.id}
							className="w-full flex gap-2"
							onClick={() => navigate("/empresas/" + empresa.id)}
						>
							<img
								className="rounded-l border-r object-cover aspect-square w-[80px]"
								src={empresa.nomeImagemFilial ? "https://localhost:5001/imagens/" + empresa.nomeImagemFilial : placeholder}
							/>

							<div className="p-2 flex items-center">
								<div className="flex flex-col gap-1">
									<span className="line-clamp-1 font-semibold text-sm">{empresa.nome}</span>
									<div className="flex gap-2 flex-wrap">
										<Badge
											variant="secondary"
											className="p-1 py-0"
										>
											{empresa.cnpj}
										</Badge>
									</div>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</>
	);
}
