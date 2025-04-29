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
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BuildingIcon, ChevronDown, CreditCard, Edit, Eye, PlusCircle, Search, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContaFornecedor, Fornecedor } from "@/lib/types";

// Função auxiliar para formatar CNPJ
const formatarCNPJ = (cnpj: string): string => {
	if (!cnpj) return "-";

	// Remove caracteres não numéricos
	const numeros = cnpj.replace(/\D/g, "");

	// Formata como 00.000.000/0000-00
	if (numeros.length === 14) {
		return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
	}

	return cnpj;
};

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

const Fornecedores = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);
	const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; fornecedor: Fornecedor | null }>({
		open: false,
		fornecedor: null,
	});
	const [detailsDialog, setDetailsDialog] = useState(false);

	// Para exibir as contas do fornecedor selecionado
	const [tabView, setTabView] = useState<"detalhes" | "contas">("detalhes");
	const [contaDialog, setContaDialog] = useState<{ open: boolean; conta: ContaFornecedor | null; isEditing: boolean }>({
		open: false,
		conta: null,
		isEditing: false,
	});
	const [deleteContaDialog, setDeleteContaDialog] = useState<{ open: boolean; conta: ContaFornecedor | null }>({
		open: false,
		conta: null,
	});

	useEffect(() => {
		fetchFornecedores();

		// Exibe mensagem de sucesso ao retornar da página de cadastro
		if (location.state?.success) {
			toast.success(location.state.message);

			// Limpa o state para não mostrar o toast novamente em atualizações
			navigate(location.pathname, { replace: true });
		}
	}, [location.state, navigate]);

	const fetchFornecedores = async () => {
		setIsLoading(true);
		try {
			const response = await api.get("/v1/fornecedores");
			setFornecedores(response.data);
		} catch (error) {
			console.error("Erro ao carregar fornecedores:", error);
			toast.error("Erro ao carregar fornecedores");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchFornecedorDetails = async (id: number) => {
		try {
			const [fornecedorResponse, contasResponse] = await Promise.all([api.get(`/v1/fornecedores/${id}`), api.get(`/v1/fornecedores/${id}/conta`)]);

			const fornecedorData = fornecedorResponse.data;
			fornecedorData.contas = contasResponse.data || [];

			setSelectedFornecedor(fornecedorData);
			setDetailsDialog(true);
		} catch (error) {
			console.error("Erro ao carregar detalhes do fornecedor:", error);
			toast.error("Erro ao carregar detalhes do fornecedor");
		}
	};

	// Função para excluir um fornecedor
	const excluirFornecedor = async (id: number) => {
		try {
			await api.delete(`/v1/fornecedores/${id}`);

			// Atualiza a lista de fornecedores
			setFornecedores((prevFornecedores) => prevFornecedores.filter((fornecedor) => fornecedor.id !== id));

			toast.success("Fornecedor excluído com sucesso!");
			setDeleteDialog({ open: false, fornecedor: null });
		} catch (error) {
			console.error("Erro ao excluir fornecedor:", error);
			toast.error("Não foi possível excluir o fornecedor");
		}
	};

	// Função para excluir uma conta do fornecedor
	const excluirContaFornecedor = async (idConta: number) => {
		try {
			await api.delete(`/v1/fornecedores/conta/${idConta}`);

			// Atualiza o fornecedor selecionado, removendo a conta
			if (selectedFornecedor) {
				const updatedFornecedor = {
					...selectedFornecedor,
					contas: selectedFornecedor.contas?.filter((conta) => conta.id !== idConta) || [],
				};
				setSelectedFornecedor(updatedFornecedor);
			}

			toast.success("Conta bancária excluída com sucesso!");
			setDeleteContaDialog({ open: false, conta: null });
		} catch (error) {
			console.error("Erro ao excluir conta bancária:", error);
			toast.error("Não foi possível excluir a conta bancária");
		}
	};

	// Filtrar fornecedores com base na pesquisa
	const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
		const matchesSearch =
			fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(fornecedor.cpF_CNPJ || "").includes(searchTerm) ||
			(fornecedor.telefone || "").includes(searchTerm) ||
			(fornecedor.email || "").toLowerCase().includes(searchTerm.toLowerCase());

		return matchesSearch;
	});

	return (
		<div className="container py-6">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Fornecedores</h1>
				<Button
					className="flex items-center"
					onClick={() => navigate("/fornecedores/novo")}
				>
					<PlusCircle className="mr-2 h-4 w-4" />
					Novo Fornecedor
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Gerenciamento de Fornecedores</CardTitle>
					<CardDescription>Visualize, edite e gerencie os fornecedores cadastrados no sistema.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex w-full max-w-sm items-center space-x-2 relative">
							<Input
								type="text"
								placeholder="Buscar por nome, CNPJ, telefone ou email..."
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

						<div className="flex flex-wrap gap-2">{/* O select de statusFilter foi removido daqui */}</div>
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
					) : fornecedoresFiltrados.length === 0 ? (
						// Mensagem quando não há fornecedores
						<div className="flex flex-col items-center justify-center py-10 text-center">
							<AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
							<h3 className="mb-1 text-lg font-medium">Nenhum fornecedor encontrado</h3>
							<p className="text-sm text-muted-foreground">
								{searchTerm ? "Tente ajustar sua busca para encontrar o que procura." : "Não há fornecedores cadastrados no sistema."}
							</p>
						</div>
					) : (
						// Tabela de fornecedores
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Fornecedor</TableHead>
										<TableHead>CNPJ</TableHead>
										<TableHead>Contato</TableHead>
										<TableHead className="text-right">Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{fornecedoresFiltrados.map((fornecedor: Fornecedor) => (
										<TableRow key={fornecedor.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
														<BuildingIcon className="h-5 w-5" />
													</div>
													<div>
														<div className="font-medium">{fornecedor.nome.toUpperCase()}</div>
														<div className="text-sm text-muted-foreground">{fornecedor.email || fornecedor.ramo?.descricao || "-"}</div>
													</div>
												</div>
											</TableCell>
											<TableCell>{formatarCNPJ(fornecedor.cpF_CNPJ)}</TableCell>
											<TableCell>
												<div>
													<div>{fornecedor.nomeContato || "-"}</div>
													<div className="text-sm text-muted-foreground">{formatarTelefone(fornecedor.telefone)}</div>
												</div>
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
														<DropdownMenuLabel>{fornecedor.nome.toUpperCase()}</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem onClick={() => fetchFornecedorDetails(fornecedor.id)}>
															<Eye className="mr-2 h-4 w-4" />
															Visualizar
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => navigate(`/fornecedores/editar/${fornecedor.id}`)}>
															<Edit className="mr-2 h-4 w-4" />
															Editar
														</DropdownMenuItem>
														<Separator className="my-1" />
														<DropdownMenuItem
															className="text-destructive focus:text-destructive"
															onClick={() => setDeleteDialog({ open: true, fornecedor })}
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
						<DialogTitle>Excluir fornecedor</DialogTitle>
						<DialogDescription>
							Esta ação não pode ser desfeita. Isso excluirá permanentemente o fornecedor{" "}
							<span className="font-semibold">{deleteDialog.fornecedor?.nome?.toUpperCase()}</span> e suas informações do sistema.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialog({ open: false, fornecedor: null })}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteDialog.fornecedor && excluirFornecedor(deleteDialog.fornecedor.id)}
						>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Diálogo de detalhes do fornecedor */}
			<Dialog
				open={detailsDialog}
				onOpenChange={(open) => !open && setDetailsDialog(false)}
			>
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<BuildingIcon className="h-5 w-5" />
							{selectedFornecedor?.nome?.toUpperCase()}
						</DialogTitle>
						<DialogDescription>Detalhes completos do fornecedor e suas contas bancárias.</DialogDescription>
					</DialogHeader>

					{selectedFornecedor && (
						<Tabs
							value={tabView}
							onValueChange={(v) => setTabView(v as "detalhes" | "contas")}
						>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="detalhes">Detalhes</TabsTrigger>
								<TabsTrigger value="contas">Contas Bancárias</TabsTrigger>
							</TabsList>

							<TabsContent
								value="detalhes"
								className="space-y-4 pt-4"
							>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">CNPJ/CPF</h4>
										<p>{formatarCNPJ(selectedFornecedor.cpF_CNPJ)}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">Inscrição Estadual</h4>
										<p>{selectedFornecedor.inscricaoEstadual || "-"}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">Contato</h4>
										<p>{selectedFornecedor.nomeContato || "-"}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">Telefone</h4>
										<p>{formatarTelefone(selectedFornecedor.telefone)}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">Email</h4>
										<p>{selectedFornecedor.email || "-"}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">Website</h4>
										<p>{selectedFornecedor.site || "-"}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">Ramo</h4>
										<p>{selectedFornecedor.ramo?.descricao || "-"}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">Tipo</h4>
										<Badge variant="outline">{selectedFornecedor.tipo === "J" ? "Pessoa Jurídica" : "Pessoa Física"}</Badge>
									</div>
								</div>

								<Separator className="my-4" />

								<div>
									<h4 className="text-sm font-medium text-muted-foreground mb-2">Endereço</h4>
									{selectedFornecedor.endereco ? (
										<div className="text-sm">
											<p>
												{selectedFornecedor.endereco.logradouro}, {selectedFornecedor.endereco.numero}
												{selectedFornecedor.endereco.complemento && `, ${selectedFornecedor.endereco.complemento}`}
											</p>
											<p>
												{selectedFornecedor.endereco.bairro && `${selectedFornecedor.endereco.bairro} - `}
												{selectedFornecedor.endereco.cidade && `${selectedFornecedor.endereco.cidade}/`}
												{selectedFornecedor.endereco.estado}
											</p>
											<p>CEP: {selectedFornecedor.endereco.cep}</p>
										</div>
									) : (
										<p>Nenhum endereço cadastrado</p>
									)}
								</div>

								{selectedFornecedor.nomeRepresentante && (
									<>
										<Separator className="my-4" />
										<div>
											<h4 className="text-sm font-medium text-muted-foreground mb-2">Representante</h4>
											<div className="text-sm">
												<p className="font-medium">{selectedFornecedor.nomeRepresentante}</p>
												<p>Telefone: {formatarTelefone(selectedFornecedor.telefoneRepresentante) || "-"}</p>
												<p>Celular: {formatarTelefone(selectedFornecedor.celularRepresentante) || "-"}</p>
												<p>Email: {selectedFornecedor.emailRepresentante || "-"}</p>
											</div>
										</div>
									</>
								)}

								{selectedFornecedor.enderecoRepresentante && selectedFornecedor.enderecoRepresentante.logradouro && (
									<div className="mt-2">
										<h4 className="text-sm font-medium text-muted-foreground mb-2">Endereço do Representante</h4>
										<div className="text-sm">
											<p>
												{selectedFornecedor.enderecoRepresentante.logradouro},{selectedFornecedor.enderecoRepresentante.numero}
												{selectedFornecedor.enderecoRepresentante.complemento && `, ${selectedFornecedor.enderecoRepresentante.complemento}`}
											</p>
											<p>
												{selectedFornecedor.enderecoRepresentante.bairro && `${selectedFornecedor.enderecoRepresentante.bairro} - `}
												{selectedFornecedor.enderecoRepresentante.cidade && `${selectedFornecedor.enderecoRepresentante.cidade}/`}
												{selectedFornecedor.enderecoRepresentante.estado}
											</p>
											<p>CEP: {selectedFornecedor.enderecoRepresentante.cep}</p>
										</div>
									</div>
								)}
							</TabsContent>

							<TabsContent
								value="contas"
								className="pt-4"
							>
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-medium">Contas Bancárias</h3>
									<Button
										size="sm"
										onClick={() => setContaDialog({ open: true, conta: null, isEditing: false })}
									>
										<PlusCircle className="h-4 w-4 mr-2" />
										Nova Conta
									</Button>
								</div>

								{selectedFornecedor.contas && selectedFornecedor.contas.length > 0 ? (
									<div className="space-y-4">
										{selectedFornecedor.contas.map((conta) => (
											<Card key={conta.id}>
												<CardContent className="p-4">
													<div className="flex justify-between items-start">
														<div className="flex items-center gap-3">
															<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
																<CreditCard className="h-5 w-5" />
															</div>
															<div>
																<div className="font-medium">{conta.banco?.nomeBanco || `Banco ID: ${conta.idBanco}`}</div>
																<div className="text-sm text-muted-foreground">
																	Agência: {conta.agencia}
																	{conta.agenciaDigito ? `-${conta.agenciaDigito}` : ""} | Conta: {conta.conta}-{conta.contaDigito}
																</div>
															</div>
														</div>
														<Badge variant={conta.principalConta === "1" ? "default" : "outline"}>
															{conta.principalConta === "1" ? "Principal" : "Secundária"}
														</Badge>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																>
																	<ChevronDown className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuItem
																	onClick={() =>
																		setContaDialog({
																			open: true,
																			conta,
																			isEditing: true,
																		})
																	}
																>
																	<Edit className="mr-2 h-4 w-4" />
																	Editar
																</DropdownMenuItem>
																<DropdownMenuItem
																	className="text-destructive"
																	onClick={() => setDeleteContaDialog({ open: true, conta })}
																>
																	<Trash2 className="mr-2 h-4 w-4" />
																	Excluir
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>

													<div className="grid grid-cols-2 gap-2 mt-4 text-sm">
														<div>
															<span className="text-muted-foreground">Código do Banco:</span> {conta.banco?.codigoBanco || "-"}
														</div>
														{conta.pix && (
															<div>
																<span className="text-muted-foreground">Chave PIX:</span> {conta.pix}
															</div>
														)}
														{conta.banco?.siteBanco && (
															<div className="col-span-2">
																<span className="text-muted-foreground">Website do Banco:</span>{" "}
																<a
																	href={conta.banco.siteBanco}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-primary hover:underline"
																>
																	{conta.banco.siteBanco}
																</a>
															</div>
														)}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className="flex flex-col items-center justify-center py-8 text-center border rounded-md">
										<CreditCard className="h-10 w-10 text-muted-foreground mb-2" />
										<h3 className="text-lg font-medium">Nenhuma conta bancária</h3>
										<p className="text-sm text-muted-foreground mb-4">Este fornecedor não possui contas bancárias cadastradas.</p>
										<Button
											variant="outline"
											onClick={() => setContaDialog({ open: true, conta: null, isEditing: false })}
										>
											<PlusCircle className="h-4 w-4 mr-2" />
											Adicionar Conta
										</Button>
									</div>
								)}
							</TabsContent>
						</Tabs>
					)}

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDetailsDialog(false)}
						>
							Fechar
						</Button>
						<Button
							onClick={() => {
								setDetailsDialog(false);
								navigate(`/fornecedores/editar/${selectedFornecedor?.id}`);
							}}
						>
							<Edit className="h-4 w-4 mr-2" />
							Editar Fornecedor
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Diálogo de confirmação de exclusão de conta */}
			<Dialog
				open={deleteContaDialog.open}
				onOpenChange={(open) => !open && setDeleteContaDialog({ ...deleteContaDialog, open })}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Excluir conta bancária</DialogTitle>
						<DialogDescription>
							Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta bancária do banco{" "}
							<span className="font-semibold">{deleteContaDialog.conta?.banco?.nomeBanco || `ID: ${deleteContaDialog.conta?.idBanco}`}</span>.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteContaDialog({ open: false, conta: null })}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteContaDialog.conta && excluirContaFornecedor(deleteContaDialog.conta.id)}
						>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Fornecedores;
