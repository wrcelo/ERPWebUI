import { DataTableProdutos } from "@/components/custom/DataTableProdutos";
import { DialogAddProduct } from "@/components/custom/DialogAddProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnsProdutos } from "@/lib/columns";
import { Produto } from "@/lib/types";
import { ListFilter, Plus } from "lucide-react";
import { useState } from "react";

const Produtos = () => {
	const handleDelete = () => {};
	const handleEdit = () => {};
	const dadosProdutos: Produto[] = [
		{
			id: "1",
			nome: "Tecido",
			imgUrl: "https://png.pngtree.com/thumb_back/fw800/background/20231014/pngtree-background-of-clothing-texture-in-white-fabric-image_13613064.png",
			descricao: "Pano legal",
			cores: [
				{ descricaoCor: "verde", hexadecimalCor: "#23E607" },
				{ descricaoCor: "azul", hexadecimalCor: "#eebb00" },
			],
			estoqueEmMetros: 120,
		},
	];

	const [isOpen, setIsOpen] = useState(false);

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
						<div className="hidden lg:block ">Adicionar Produto</div>
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
				<DialogAddProduct
					open={isOpen}
					onOpenChange={setIsOpen}
				/>
				<DataTableProdutos
					columns={ColumnsProdutos({
						onEdit: handleEdit,
						onDelete: handleDelete,
					})}
					data={dadosProdutos}
				/>
			</div>
		</>
	);
};

export default Produtos;
