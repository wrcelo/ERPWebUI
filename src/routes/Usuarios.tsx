import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ChevronDown, Edit, PlusCircle, Search, Trash, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface para representar um usuário
interface Usuario {
	id: number;
	nome: string;
	email: string;
	ativo: boolean;
	perfil: string;
	departamento: string;
	dataCriacao: string;
	ultimoAcesso: string | null;
}

// Enum para os tipos de perfil
enum PerfilUsuario {
	ADMIN = "Administrador",
	VENDEDOR = "Vendedor",
	FINANCEIRO = "Financeiro",
	ESTOQUE = "Estoque",
	PRODUCAO = "Produção",
}

// Dados mocados
const usuariosMock: Usuario[] = [
	{
		id: 1,
		nome: "Admin",
		email: "admin@exemplo.com",
		ativo: true,
		perfil: PerfilUsuario.ADMIN,
		departamento: "Diretoria",
		dataCriacao: "2023-10-15T10:30:00",
		ultimoAcesso: "2025-04-26T09:15:32",
	},
	{
		id: 2,
		nome: "João Silva",
		email: "joao.silva@exemplo.com",
		ativo: true,
		perfil: PerfilUsuario.VENDEDOR,
		departamento: "Comercial",
		dataCriacao: "2023-11-20T14:22:10",
		ultimoAcesso: "2025-04-25T16:45:22",
	},
	{
		id: 3,
		nome: "Maria Santos",
		email: "maria.santos@exemplo.com",
		ativo: true,
		perfil: PerfilUsuario.FINANCEIRO,
		departamento: "Financeiro",
		dataCriacao: "2024-01-05T09:12:45",
		ultimoAcesso: "2025-04-23T11:32:18",
	},
	{
		id: 4,
		nome: "Pedro Oliveira",
		email: "pedro.oliveira@exemplo.com",
		ativo: false,
		perfil: PerfilUsuario.ESTOQUE,
		departamento: "Logística",
		dataCriacao: "2023-09-10T08:45:30",
		ultimoAcesso: "2025-03-15T14:20:10",
	},
	{
		id: 5,
		nome: "Ana Carolina",
		email: "ana.carolina@exemplo.com",
		ativo: true,
		perfil: PerfilUsuario.PRODUCAO,
		departamento: "Produção",
		dataCriacao: "2024-02-18T11:30:15",
		ultimoAcesso: "2025-04-24T10:15:45",
	},
	{
		id: 6,
		nome: "Carlos Eduardo",
		email: "carlos.eduardo@exemplo.com",
		ativo: true,
		perfil: PerfilUsuario.VENDEDOR,
		departamento: "Comercial",
		dataCriacao: "2024-01-25T16:20:40",
		ultimoAcesso: "2025-04-22T09:30:25",
	},
	{
		id: 7,
		nome: "Luciana Ferreira",
		email: "luciana.ferreira@exemplo.com",
		ativo: true,
		perfil: PerfilUsuario.FINANCEIRO,
		departamento: "Financeiro",
		dataCriacao: "2023-12-12T13:45:20",
		ultimoAcesso: "2025-04-20T15:40:12",
	},
	{
		id: 8,
		nome: "Roberto Almeida",
		email: "roberto.almeida@exemplo.com",
		ativo: false,
		perfil: PerfilUsuario.ADMIN,
		departamento: "TI",
		dataCriacao: "2023-08-30T10:10:10",
		ultimoAcesso: null,
	},
];

const Usuarios = () => {
	const navigate = useNavigate();
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; usuario: Usuario | null }>({
		open: false,
		usuario: null,
	});
	const [perfilFilter, setPerfilFilter] = useState<string>("todos");
	const [statusFilter, setStatusFilter] = useState<string>("todos");

	// Simula o carregamento de dados da API
	useEffect(() => {
		const timer = setTimeout(() => {
			setUsuarios(usuariosMock);
			setIsLoading(false);
		}, 800);

		return () => clearTimeout(timer);
	}, []);

	// Função para formatar datas
	const formatarData = (data: string | null) => {
		if (!data) return "Nunca acessou";
		const date = new Date(data);
		return new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	// Filtra os usuários com base na pesquisa e filtros selecionados
	const usuariosFiltrados = usuarios.filter((usuario) => {
		const matchesSearch =
			usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			usuario.departamento.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesPerfil = perfilFilter === "todos" || perfilFilter === "" || usuario.perfil === perfilFilter;

		const matchesStatus =
			statusFilter === "todos" || statusFilter === "" || (statusFilter === "ativo" && usuario.ativo) || (statusFilter === "inativo" && !usuario.ativo);

		return matchesSearch && matchesPerfil && matchesStatus;
	});

	// Função para excluir um usuário
	const excluirUsuario = (id: number) => {
		// Simulação de exclusão no array mocado
		setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
		toast.success("Usuário excluído com sucesso!");
		setDeleteDialog({ open: false, usuario: null });
	};

	// Função para alternar o status de um usuário
	const toggleStatusUsuario = (id: number) => {
		setUsuarios(usuarios.map((usuario) => (usuario.id === id ? { ...usuario, ativo: !usuario.ativo } : usuario)));

		const usuario = usuarios.find((u) => u.id === id);
		if (usuario) {
			toast.success(`Usuário ${usuario.ativo ? "desativado" : "ativado"} com sucesso!`);
		}
	};

	return (
		<div className="container py-6">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Usuários</h1>
				<Button
					className="flex items-center"
					onClick={() => navigate("/usuarios/novo")}
				>
					<PlusCircle className="mr-2 h-4 w-4" />
					Novo Usuário
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Gerenciamento de Usuários</CardTitle>
					<CardDescription>Gerencie os usuários do sistema ERP.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex w-full max-w-sm items-center space-x-2">
							<Input
								type="text"
								placeholder="Buscar por nome, email ou departamento..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="max-w-xs"
								// prefix={<Search className="h-4 w-4 text-muted-foreground" />}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<Select
								value={perfilFilter}
								onValueChange={setPerfilFilter}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filtrar por perfil" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todos">Todos os perfis</SelectItem>
									{Object.values(PerfilUsuario).map((perfil) => (
										<SelectItem
											key={perfil}
											value={perfil}
										>
											{perfil}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filtrar por status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todos">Todos os status</SelectItem>
									<SelectItem value="ativo">Ativos</SelectItem>
									<SelectItem value="inativo">Inativos</SelectItem>
								</SelectContent>
							</Select>
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
					) : usuariosFiltrados.length === 0 ? (
						// Mensagem quando não há usuários
						<div className="flex flex-col items-center justify-center py-10 text-center">
							<AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
							<h3 className="mb-1 text-lg font-medium">Nenhum usuário encontrado</h3>
							<p className="text-sm text-muted-foreground">
								{searchTerm || perfilFilter || statusFilter
									? "Tente ajustar seus filtros para encontrar o que procura."
									: "Não há usuários cadastrados no sistema."}
							</p>
						</div>
					) : (
						// Tabela de usuários
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Usuário</TableHead>
										<TableHead>Perfil</TableHead>
										<TableHead>Departamento</TableHead>
										<TableHead>Último acesso</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{usuariosFiltrados.map((usuario) => (
										<TableRow key={usuario.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
														<User className="h-5 w-5" />
													</div>
													<div>
														<div className="font-medium">{usuario.nome}</div>
														<div className="text-sm text-muted-foreground">{usuario.email}</div>
													</div>
												</div>
											</TableCell>
											<TableCell>{usuario.perfil}</TableCell>
											<TableCell>{usuario.departamento}</TableCell>
											<TableCell>{formatarData(usuario.ultimoAcesso)}</TableCell>
											<TableCell>
												<Badge variant={usuario.ativo ? "default" : "outline"}>{usuario.ativo ? "Ativo" : "Inativo"}</Badge>
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
														<DropdownMenuItem onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}>
															<Edit className="mr-2 h-4 w-4" />
															Editar
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => toggleStatusUsuario(usuario.id)}>
															<Checkbox
																className="mr-2 h-4 w-4"
																checked={usuario.ativo}
																id={`status-${usuario.id}`}
																onCheckedChange={() => {}}
															/>
															{usuario.ativo ? "Desativar" : "Ativar"}
														</DropdownMenuItem>
														<Separator className="my-1" />
														<DropdownMenuItem
															className="text-destructive focus:text-destructive"
															onClick={() => setDeleteDialog({ open: true, usuario: usuario })}
														>
															<Trash className="mr-2 h-4 w-4" />
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
						<DialogTitle>Excluir usuário</DialogTitle>
						<DialogDescription>
							Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário <span className="font-semibold">{deleteDialog.usuario?.nome}</span> e
							suas informações do sistema.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialog({ open: false, usuario: null })}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteDialog.usuario && excluirUsuario(deleteDialog.usuario.id)}
						>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Usuarios;
