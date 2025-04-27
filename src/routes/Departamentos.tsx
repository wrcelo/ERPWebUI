import api from "@/api/api";
import { DataTableDepartamentos } from "@/components/custom/DataTableDepartamentos";
import { DialogAddDepartmento } from "@/components/custom/DialogAddDepartamento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnsDepartamentos } from "@/lib/columns";
import { Departamento } from "@/lib/types";
import { ListFilter, Plug, Plus, SearchIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

const Departamentos = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
	const [filteredDepartamentos, setFilteredDepartamentos] = useState<Departamento[]>([]);
	const [searchQuery, setSearchQuery] = useState("");

	// Estados para edição
	const [departamentoEdit, setDepartamentoEdit] = useState<Departamento | null>(null);
	const [nomeDepartamentoEdit, setNomeDepartamentoEdit] = useState("");

	// Estado para exclusão
	const [departamentoDelete, setDepartamentoDelete] = useState<Departamento | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		handleFetch();
	}, []);

	const handleAdd = () => {
		handleFetch();
	};

	const handleFetch = () => {
		api.get("/v1/departamentos").then((res) => {
			setDepartamentos(res.data);
			setFilteredDepartamentos(res.data);
		});
	};

	// Função para abrir o modal de edição
	const handleEditOpen = (departamento: Departamento) => {
		setDepartamentoEdit(departamento);
		setNomeDepartamentoEdit(departamento.nomeDepartamento);
		setIsEditOpen(true);
	};

	// Função para atualizar o departamento
	const handleEdit = () => {
		if (!departamentoEdit) return;

		const putData = {
			nomeDepartamento: nomeDepartamentoEdit,
		};

		api
			.put(`/v1/departamentos/${departamentoEdit.idDepartamento}`, putData)
			.then((res) => {
				toast.success("Departamento atualizado com sucesso!");
				setIsEditOpen(false);
			})
			.catch((error) => {
				toast.error("Ocorreu um erro!", {
					description: "Falha ao atualizar departamento",
					action: <Plug />,
				});
			})
			.finally(() => {
				handleFetch();
			});
	};

	// Função para abrir o modal de confirmação de exclusão
	const handleDeleteConfirm = (departamento: Departamento) => {
		setDepartamentoDelete(departamento);
		setIsDeleteOpen(true);
	};

	// Função para excluir o departamento após confirmação
	const handleDelete = () => {
		if (!departamentoDelete) return;

		setIsDeleting(true);

		api
			.delete(`/v1/departamentos/${departamentoDelete.idDepartamento}`)
			.then((res) => {
				toast.success("Departamento excluído com sucesso!");
			})
			.catch(() => {
				toast.error("Ocorreu um erro!", {
					description: "Falha ao excluir departamento",
					action: <Plug />,
				});
			})
			.finally(() => {
				setIsDeleting(false);
				setIsDeleteOpen(false);
				handleFetch();
			});
	};

	// Função para buscar departamentos
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);

		if (!query.trim()) {
			setFilteredDepartamentos(departamentos);
		} else {
			const filtered = departamentos.filter((departamento: Departamento) => departamento.nomeDepartamento.toLowerCase().includes(query));
			setFilteredDepartamentos(filtered);
		}
	};

	// Limpar busca
	const clearSearch = () => {
		setSearchQuery("");
		setFilteredDepartamentos(departamentos);
	};

	return (
		<>
			<div className="mb-6 flex gap-2 justify-between">
				<div className="flex gap-2">
					<Button
						onClick={() => {
							setIsOpen(true);
						}}
						className="gap-2"
					>
						<Plus className="w-4 h-4" />
						<div className="hidden lg:block">Adicionar Departamento</div>
					</Button>
					<Button
						className="gap-1"
						variant={"outline"}
					>
						<ListFilter className="w-4 h-4" />
						<div className="hidden lg:block">Filtrar</div>
					</Button>
				</div>
				<div>
					<div className="flex w-full max-w-sm items-center space-x-2 relative">
						<Input
							type="text"
							placeholder="Buscar departamento..."
							value={searchQuery}
							onChange={handleSearch}
							className="pl-8"
						/>
						<SearchIcon className="w-4 h-4 absolute left-1 text-muted-foreground" />
						{searchQuery && (
							<Button
								variant="ghost"
								className="h-8 w-8 p-0 absolute right-2"
								onClick={clearSearch}
							>
								<XCircle className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</div>
			<div>
				{/* Modal para adicionar departamento (existente) */}
				<DialogAddDepartmento
					open={isOpen}
					onOpenChange={setIsOpen}
					onAdd={handleAdd}
				/>

				{/* Modal para editar departamento */}
				<Dialog
					open={isEditOpen}
					onOpenChange={setIsEditOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar Departamento</DialogTitle>
							<DialogDescription>Edite as informações do departamento abaixo.</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="nomeDepartamentoEdit">Nome do Departamento</Label>
								<Input
									id="nomeDepartamentoEdit"
									value={nomeDepartamentoEdit}
									onChange={(e) => setNomeDepartamentoEdit(e.target.value)}
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancelar</Button>
							</DialogClose>
							<Button onClick={handleEdit}>Salvar Alterações</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Modal de confirmação para excluir departamento */}
				<AlertDialog
					open={isDeleteOpen}
					onOpenChange={setIsDeleteOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
							<AlertDialogDescription>
								Tem certeza que deseja excluir o departamento <span className="font-medium">{departamentoDelete?.nomeDepartamento}</span>?
								<br />
								Esta ação não poderá ser desfeita.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
							<AlertDialogAction
								onClick={(e) => {
									e.preventDefault();
									handleDelete();
								}}
								disabled={isDeleting}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								{isDeleting ? "Excluindo..." : "Excluir"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				{/* Tabela de dados */}
				<DataTableDepartamentos
					columns={ColumnsDepartamentos({
						onEdit: handleEditOpen,
						onDelete: handleDeleteConfirm,
					})}
					data={filteredDepartamentos}
				/>
			</div>
		</>
	);
};

export default Departamentos;
