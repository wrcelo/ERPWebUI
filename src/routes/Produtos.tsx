import { DataTable } from "@/components/custom/DataTable";
import { ColumnsProdutos } from "@/lib/columns";

const Produtos = () => {
	const handleDelete = () => {};
	const handleEdit = () => {};
	return (
		<>
			<div>
				<DataTable
					columns={ColumnsProdutos({ onEdit: handleEdit, onDelete: handleDelete })}
					data={[]}
				/>
			</div>
		</>
	);
};

export default Produtos;
