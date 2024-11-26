import { DataTableClientes } from "@/components/custom/DataTableClientes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnsClientes } from "@/lib/columns";
import { Cliente } from "@/lib/types";
import { ListFilter, Plus } from "lucide-react";

const Clientes = () => {
	const handleDelete = () => {};
	const handleEdit = () => {};

	const dadosClientes: Cliente[] = [
		{
			id: "1",
			nome: "Farm Rio",
			imgUrl: "https://riomarca-miami.s3.amazonaws.com/2023/10/logo-farm.jpg",
			descricao: "Empresa de vestuário do Rio de Janeiro",
		},
		{
			id: "2",
			nome: "Empório dos Tecidos",
			imgUrl:
				"https://img.freepik.com/vetores-premium/fios-de-fibra-tecidos-juntos-fibras-de-roupas-em-varias-cores-detalhes-de-um-tecido-ou-modelo-de-logotipo-de-modelo-vetorial-de-tecido_100655-2775.jpg?semt=ais_hybrid",
			descricao: "Empresa de tecidos de Minas Gerais",
		},
	];
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
							onInput={() => console.log("teste")}
						/>
					</div>
				</div>
			</div>
			<div>
				<DataTableClientes
					columns={ColumnsClientes({
						onEdit: handleEdit,
						onDelete: handleDelete,
					})}
					data={dadosClientes}
				/>
			</div>
		</>
	);
};

export default Clientes;
