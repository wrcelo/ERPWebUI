import api from "@/api/api";
import { DataTableDepartamentos } from "@/components/custom/DataTableDepartamentos";
import { DialogAddDepartmento } from "@/components/custom/DialogAddDepartamento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnsDepartamentos } from "@/lib/columns";
import { Departamento } from "@/lib/types";
import { ListFilter, Plug, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const Departamentos = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

	useEffect(() => {
		handleFetch();
	}, []);
	const handleAdd = () => {
		handleFetch();
	};
	const handleFetch = () => {
		api.get("/v1/departamentos").then((res) => {
			setDepartamentos(res.data);
		});
	};
	const handleDelete = (departamento: Departamento) => {
		api
			.delete("/v1/departamentos/" + departamento.idDepartamento)
			.then((res) => {
				console.log(res);
				toast.success(res.data);
			})
			.catch(() => {
				toast.error("Ocorreu um erro!", { description: "Falha ao excluir departamento", action: <Plug /> });
			})
			.finally(() => {
				handleFetch();
			});
	};
	const handleEdit = () => {};
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
						<div className="hidden lg:block ">Adicionar Departamento</div>
					</Button>
					{/* <Button
						className="aspect-square"
						variant={"outline"}
					>
						<Import />
					</Button> */}
					<Button
						className="gap-1"
						variant={"outline"}
					>
						<ListFilter className="w-4 h-4" />
						<div className="hidden lg:block">Filtrar</div>
					</Button>
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
				<DialogAddDepartmento
					open={isOpen}
					onOpenChange={setIsOpen}
					onAdd={handleAdd}
				/>
				<DataTableDepartamentos
					columns={ColumnsDepartamentos({
						onEdit: handleEdit,
						onDelete: handleDelete,
					})}
					data={departamentos}
				/>
			</div>
		</>
	);
};

export default Departamentos;
