import api from "@/api/api";
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
import { Cliente, Ramo } from "@/lib/types";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, getFilteredRowModel } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Edit, Filter, MoreHorizontal, Plus, SearchIcon, Trash2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Função auxiliar para formatar telefones
const formatarTelefone = (telefone: string | null | undefined): string => {
	if (!telefone) return "-";

	// Remove caracteres não numéricos
	const numeros = telefone.replace(/\D/g, "");

	// Verifica o tamanho para determinar o formato
	if (numeros.length === 10) {
		// Formato (00) 0000-0000
		return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6, 10)}`;
	} else if (numeros.length === 11) {
		// Formato (00) 00000-0000 (com o nono dígito)
		return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
	} else if (numeros.length === 8) {
		// Formato 0000-0000 (sem DDD)
		return `${numeros.slice(0, 4)}-${numeros.slice(4, 8)}`;
	} else if (numeros.length === 9) {
		// Formato 00000-0000 (sem DDD, com nono dígito)
		return `${numeros.slice(0, 5)}-${numeros.slice(5, 9)}`;
	}

	// Se não se encaixar nos formatos acima, retorna como está
	return telefone;
};

const Clientes = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [dadosClientes, setDadosClientes] = useState<Cliente[]>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [ramosFilter, setRamosFilter] = useState<string[]>([]);
	const [ramos, setRamos] = useState<Ramo[]>([]);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [tempRamosFilter, setTempRamosFilter] = useState<string[]>([]);

	// Estado para controlar o modal de exclusão
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		handleFetch();
		fetchRamos();

		// Exibe mensagem de sucesso ao retornar da página de cadastro
		if (location.state?.success) {
			toast("Sucesso!", {
				description: location.state.message,
			});

			// Limpa o state para não mostrar o toast novamente em atualizações
			navigate(location.pathname, { replace: true });
		}
	}, [location.state, navigate]);

	// Quando o modal é aberto, inicializa tempRamosFilter com o valor atual de ramosFilter
	useEffect(() => {
		if (showFilterModal) {
			setTempRamosFilter([...ramosFilter]);
		}
	}, [showFilterModal, ramosFilter]);

	const openDeleteModal = (cliente: Cliente) => {
		setClienteToDelete(cliente);
		setIsDeleteModalOpen(true);
	};
	const handleDeleteCliente = async () => {
		if (!clienteToDelete) return;

		try {
			setIsDeleting(true);
			await api.delete(`/v1/clientes/${clienteToDelete.id}`);

			// Remover o cliente da lista local sem precisar fazer nova requisição
			setDadosClientes((prevClientes) => prevClientes.filter((c) => c.id !== clienteToDelete.id));

			toast("Sucesso!", {
				description: `Cliente ${clienteToDelete.nome} excluído com sucesso!`,
			});
		} catch (error) {
			console.error("Erro ao excluir cliente:", error);
			toast("Erro", {
				description: "Não foi possível excluir o cliente",
			});
		} finally {
			setIsDeleting(false);
			setIsDeleteModalOpen(false);
			setClienteToDelete(null);
		}
	};

	const handleFetch = () => {
		api.get("/v1/clientes").then((res) => {
			setDadosClientes(res.data);
		});
	};

	const fetchRamos = () => {
		api
			.get("/v1/ramos")
			.then((res) => {
				setRamos(res.data);
			})
			.catch((error) => {
				console.error("Erro ao carregar ramos:", error);
			});
	};

	// Filtra clientes por múltiplos ramos
	const filteredData = useMemo(() => {
		if (!ramosFilter.length) {
			return dadosClientes;
		}
		return dadosClientes.filter((cliente) => cliente.idRamo && ramosFilter.includes(cliente.idRamo.toString()));
	}, [dadosClientes, ramosFilter]);

	const columns: ColumnDef<Cliente>[] = [
		{
			id: "id",
			accessorKey: "id",
			header: "ID",
		},
		{
			id: "nome",
			accessorKey: "nome",
			header: "Nome",
			cell({ row }) {
				const cliente = row.original;
				return <span>{cliente.nome.toUpperCase()}</span>;
			},
		},
		{
			id: "telefone",
			accessorKey: "telefone",
			header: "Telefone",
			cell({ row }) {
				const cliente = row.original;
				return <span>{formatarTelefone(cliente.telefone)}</span>;
			},
		},
		{
			id: "ramo",
			accessorKey: "ramo",
			header: "Ramo",
			cell({ row }) {
				const cliente = row.original;
				return <span>{cliente.ramo?.descricao || "-"}</span>;
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const cliente = row.original;
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
							<DropdownMenuLabel>{cliente.nome.toUpperCase()}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
								className="cursor-pointer"
							>
								<Edit className="h-4 w-4" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => openDeleteModal(cliente)}
								className="cursor-pointer text-destructive focus:text-destructive"
							>
								<Trash2 className="h-4 w-4" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: (row, columnId, filterValue) => {
			const value = row.getValue(columnId);
			if (typeof value === "string") {
				return value.toLowerCase().includes(filterValue.toLowerCase());
			}
			return false;
		},
	});

	const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGlobalFilter(e.target.value);
	};

	// Função temporária para manipular a seleção de ramos no modal
	const handleTempRamoToggle = (ramoId: string) => {
		setTempRamosFilter((prev) => {
			if (prev.includes(ramoId)) {
				return prev.filter((id) => id !== ramoId);
			} else {
				return [...prev, ramoId];
			}
		});
	};

	// Função para aplicar os filtros temporários quando o usuário clica em "Aplicar"
	const applyFilters = () => {
		setRamosFilter(tempRamosFilter);
		setShowFilterModal(false);
	};

	// Remove um ramo específico do filtro
	const removeRamoFilter = (ramoId: string) => {
		setRamosFilter((prev) => prev.filter((id) => id !== ramoId));
	};

	const clearFilters = () => {
		setRamosFilter([]);
		setShowFilterModal(false);
	};

	// Limpa apenas os filtros temporários (quando o usuário cancela no modal)
	const clearTempFilters = () => {
		setTempRamosFilter([]);
	};

	// Obtém as descrições dos ramos selecionados
	const selectedRamosDescriptions = useMemo(() => {
		return ramosFilter.map((ramoId) => {
			const ramo = ramos.find((r) => r.id.toString() === ramoId);
			return {
				id: ramoId,
				descricao: ramo?.descricao || ramoId,
			};
		});
	}, [ramosFilter, ramos]);

	return (
		<>
			<div className="mb-6 flex gap-2">
				<div className="flex gap-2">
					<Button
						onClick={() => navigate("/clientes/novo")}
						className="gap-2"
					>
						<Plus className="w-4 h-4" />
						<div className="hidden lg:block">Adicionar Cliente</div>
					</Button>
					<Button
						variant="outline"
						className="gap-2"
						onClick={() => setShowFilterModal(true)}
					>
						<Filter className="w-4 h-4" />
						<div className="hidden lg:block">Filtrar</div>
						{ramosFilter.length > 0 && (
							<Badge
								variant="secondary"
								className="ml-1"
							>
								{ramosFilter.length}
							</Badge>
						)}
					</Button>
				</div>
				<div>
					<div className="flex w-full max-w-sm items-center space-x-2 relative">
						<Input
							type="text"
							placeholder="Buscar por nome..."
							value={globalFilter}
							onChange={handleFilter}
							className="pl-8"
						/>
						<SearchIcon className="w-4 h-4 absolute left-1 text-muted-foreground" />
						{globalFilter && (
							<Button
								variant="ghost"
								className="h-8 w-8 p-0 absolute right-2"
								onClick={() => setGlobalFilter("")}
							>
								<XCircle className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Modal de Filtros */}
			<Dialog
				open={showFilterModal}
				onOpenChange={setShowFilterModal}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Filtrar Clientes</DialogTitle>
						<DialogDescription>Selecione os ramos de atividade para filtrar os clientes.</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium mb-2 block">
									Ramo(s) de Atividade
									{tempRamosFilter.length > 0 && <span className="text-xs text-muted-foreground ml-2">{tempRamosFilter.length} selecionado(s)</span>}
								</label>
								<div className="border rounded-md">
									<ScrollArea className="h-[250px] p-2">
										<div className="space-y-2">
											{ramos.map((ramo) => (
												<div
													key={ramo.id}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={`ramo-modal-${ramo.id}`}
														checked={tempRamosFilter.includes(ramo.id.toString())}
														onCheckedChange={() => handleTempRamoToggle(ramo.id.toString())}
													/>
													<label
														htmlFor={`ramo-modal-${ramo.id}`}
														className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
													>
														{ramo.descricao.toUpperCase()}
													</label>
												</div>
											))}
										</div>
									</ScrollArea>
								</div>
							</div>
						</div>
					</div>

					<DialogFooter className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => {
								setShowFilterModal(false);
							}}
						>
							Cancelar
						</Button>
						<Button
							variant="secondary"
							onClick={clearTempFilters}
							disabled={tempRamosFilter.length === 0}
						>
							Limpar
						</Button>
						<Button onClick={applyFilters}>Aplicar</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div>
				<div className="rounded">
					{ramosFilter.length > 0 && (
						<div className="mb-4 flex flex-wrap items-center gap-2">
							<span className="text-xs text-muted-foreground">Filtrando por ramos:</span>
							{selectedRamosDescriptions.map((ramo) => (
								<Badge
									key={ramo.id}
									variant="outline"
									className="flex items-center gap-1"
								>
									{ramo.descricao}
									<Button
										variant="ghost"
										size="icon"
										className="h-4 w-4 p-0 ml-1"
										onClick={() => removeRamoFilter(ramo.id)}
									>
										<XCircle className="h-3 w-3" />
									</Button>
								</Badge>
							))}
							{ramosFilter.length > 1 && (
								<Button
									variant="ghost"
									size="sm"
									className="h-6 px-2 text-xs"
									onClick={clearFilters}
								>
									Limpar todos
								</Button>
							)}
						</div>
					)}

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
											{globalFilter
												? `Nenhum cliente encontrado com "${globalFilter}"`
												: ramosFilter.length > 0
												? "Nenhum cliente encontrado com os filtros aplicados"
												: "Não foi encontrado nenhum dado"}
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					<div className="flex items-center justify-end space-x-2 pt-4">
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

			{/* Modal de Confirmação de Exclusão */}
			<AlertDialog
				open={isDeleteModalOpen}
				onOpenChange={setIsDeleteModalOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja excluir o cliente <span className="font-semibold">{clienteToDelete?.nome?.toUpperCase()}</span>?
							<br />
							Esta ação não pode ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleDeleteCliente();
							}}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? "Excluindo..." : "Excluir"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default Clientes;
