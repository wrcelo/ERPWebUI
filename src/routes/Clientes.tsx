import { useState, useEffect } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronDown, Edit, Eye, Filter, PlusCircle, Search, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cliente, Ramo } from "@/lib/types";

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
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [ramos, setRamos] = useState<Ramo[]>([]);
	const [ramoFilter, setRamoFilter] = useState<string>("todos");
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; cliente: Cliente | null }>({
		open: false,
		cliente: null,
	});

	useEffect(() => {
		fetchClientes();
		fetchRamos();

		// Exibe mensagem de sucesso ao retornar da página de cadastro
		if (location.state?.success) {
			toast.success(location.state.message);

			// Limpa o state para não mostrar o toast novamente em atualizações
			navigate(location.pathname, { replace: true });
		}
	}, [location.state, navigate]);

	const fetchClientes = async () => {
		setIsLoading(true);
		try {
			const response = await api.get("/v1/clientes");
			setDadosClientes(response.data);
		} catch (error) {
			console.error("Erro ao carregar clientes:", error);
			toast.error("Erro ao carregar clientes");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchRamos = async () => {
		try {
			const response = await api.get("/v1/ramos");
			setRamos(response.data);
		} catch (error) {
			console.error("Erro ao carregar ramos:", error);
			toast.error("Erro ao carregar ramos");
		}
	};

	// Função para excluir um cliente
	const excluirCliente = async (id: number) => {
		try {
			await api.delete(`/v1/clientes/${id}`);

			// Atualiza a lista de clientes
			setDadosClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== id));

			toast.success("Cliente excluído com sucesso!");
			setDeleteDialog({ open: false, cliente: null });
		} catch (error) {
			console.error("Erro ao excluir cliente:", error);
			toast.error("Não foi possível excluir o cliente");
		}
	};

	// Filtrar clientes com base na pesquisa e no filtro de ramo
	const clientesFiltrados = dadosClientes.filter((cliente) => {
		const matchesSearch =
			cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(cliente.ramo?.descricao || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
			(cliente.telefone || "").includes(searchTerm);

		const matchesRamo = ramoFilter === "todos" || (cliente.idRamo && cliente.idRamo.toString() === ramoFilter);

		return matchesSearch && matchesRamo;
	});

	return (
		<div className="container py-6">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Clientes</h1>
				<Button
					className="flex items-center"
					onClick={() => navigate("/clientes/novo")}
				>
					<PlusCircle className="mr-2 h-4 w-4" />
					Novo Cliente
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Gerenciamento de Clientes</CardTitle>
					<CardDescription>Visualize, edite e gerencie os clientes cadastrados no sistema.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex w-full max-w-sm items-center space-x-2 relative">
							<Input
								type="text"
								placeholder="Buscar por nome, ramo ou telefone..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-8"
							/>
							<Search className="h-4 w-4 absolute left-2 text-muted-foreground" />
							{searchTerm && (
								<Button
									variant="ghost"
									className="h-8 w-8 p-0 absolute right-2"
									onClick={() => setSearchTerm("")}
								>
									<XCircle className="h-4 w-4" />
								</Button>
							)}
						</div>

						<div className="flex flex-wrap gap-2">
							{ramos.length > 0 && (
								<select
									className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									value={ramoFilter}
									onChange={(e) => setRamoFilter(e.target.value)}
								>
									<option value="todos">Todos os ramos</option>
									{ramos.map((ramo) => (
										<option
											key={ramo.id}
											value={ramo.id.toString()}
										>
											{ramo.descricao}
										</option>
									))}
								</select>
							)}
						</div>
					</div>

					{isLoading ? (
						// Esqueleto de carregamento
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, index) => (
								<div
									key={index}
									className="flex items-center space-x-4 py-3"
								>
									<Skeleton className="h-12 w-12 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-[250px]" />
										<Skeleton className="h-4 w-[200px]" />
									</div>
								</div>
							))}
						</div>
					) : clientesFiltrados.length === 0 ? (
						// Mensagem quando não há clientes
						<div className="flex flex-col items-center justify-center py-10 text-center">
							<AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
							<h3 className="mb-1 text-lg font-medium">Nenhum cliente encontrado</h3>
							<p className="text-sm text-muted-foreground">
								{searchTerm || ramoFilter !== "todos" ? "Tente ajustar seus filtros para encontrar o que procura." : "Não há clientes cadastrados no sistema."}
							</p>
						</div>
					) : (
						// Tabela de clientes
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Cliente</TableHead>
										<TableHead>Telefone</TableHead>
										<TableHead>Ramo</TableHead>
										<TableHead className="text-right">Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{clientesFiltrados.map((cliente) => (
										<TableRow key={cliente.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
														<Eye className="h-5 w-5" />
													</div>
													<div>
														<div className="font-medium">{cliente.nome.toUpperCase()}</div>
														<div className="text-sm text-muted-foreground">ID: {cliente.id}</div>
													</div>
												</div>
											</TableCell>
											<TableCell>{formatarTelefone(cliente.telefone)}</TableCell>
											<TableCell>
												{cliente.ramo ? <Badge variant="outline">{cliente.ramo.descricao}</Badge> : <span className="text-muted-foreground">-</span>}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0"
														>
															<span className="sr-only">Abrir menu</span>
															<ChevronDown className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>{cliente.nome.toUpperCase()}</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem onClick={() => navigate(`/clientes/visualizar/${cliente.id}`)}>
															<Eye className="mr-2 h-4 w-4" />
															Visualizar
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => navigate(`/clientes/editar/${cliente.id}`)}>
															<Edit className="mr-2 h-4 w-4" />
															Editar
														</DropdownMenuItem>
														<Separator className="my-1" />
														<DropdownMenuItem
															className="text-destructive focus:text-destructive"
															onClick={() => setDeleteDialog({ open: true, cliente })}
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Excluir
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Diálogo de confirmação de exclusão */}
			<Dialog
				open={deleteDialog.open}
				onOpenChange={(open) => !open && setDeleteDialog({ ...deleteDialog, open })}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Excluir cliente</DialogTitle>
						<DialogDescription>
							Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente{" "}
							<span className="font-semibold">{deleteDialog.cliente?.nome?.toUpperCase()}</span> e suas informações do sistema.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialog({ open: false, cliente: null })}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteDialog.cliente && excluirCliente(deleteDialog.cliente.id)}
						>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Clientes;
