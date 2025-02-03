import api from "@/api/api";
import { DataTableBancos } from "@/components/custom/DataTableBancos";
import { ColumnsBancos } from "@/lib/columns";
import { useEffect, useState } from "react";

const Bancos = () => {
	useEffect(() => {
		handleFetch();
	}, []);

	const [bancos, setBancos] = useState([]);

	const handleFetch = () => {
		api.get("/v1/bancos").then((data) => {
			setBancos(data.data.dados);
		});
	};
	const handleEdit = () => {};
	const handleDelete = () => {};

	return (
		<DataTableBancos
			columns={ColumnsBancos({
				onEdit: handleEdit,
				onDelete: handleDelete,
			})}
			data={bancos}
		/>
	);
};

export default Bancos;
