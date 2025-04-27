import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { Departamento } from "@/lib/types";

interface DataTableProps<Departamento, TValue> {
	columns: ColumnDef<Departamento, TValue>[];
	data: Departamento[];
}

export function DataTableDepartamentos<TValue>({ columns, data }: DataTableProps<Departamento, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	// const navigate = useNavigate();
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
		</>
	);
}
