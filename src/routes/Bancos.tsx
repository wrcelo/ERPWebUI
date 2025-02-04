import api from "@/api/api";
import { DataTableBancos } from "@/components/custom/DataTableBancos";
import { ColumnsBancos } from "@/lib/columns";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { toast } from "@/hooks/use-toast";
import { Check, CircleAlert, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Banco } from "@/lib/types";

const Bancos = () => {
	useEffect(() => {
		handleFetch();
	}, []);

	const [bancos, setBancos] = useState([]);
	const [nome, setNome] = useState("");
	const [codigo, setCodigo] = useState("");
	const [site, setSite] = useState("");
	const [nomeEdit, setNomeEdit] = useState("");
	const [codigoEdit, setCodigoEdit] = useState("");
	const [siteEdit, setSiteEdit] = useState("");
	const [open, setOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleFetch = () => {
		setIsLoading(true);
		api
			.get("/v1/bancos")
			.then((data) => {
				setBancos(data.data.dados);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleEdit = (banco: Banco) => {
		const putData = {
			nomeBanco: nomeEdit,
			codigoBanco: codigoEdit,
			siteBanco: siteEdit,
		};
		api
			.put(`/v1/bancos/${banco.idBanco}`, putData)
			.then(() => {
				toast({ title: "Registro deletado com sucesso", action: <Check /> });
			})
			.finally(() => {
				handleFetch();
			});
	};
	const handleDelete = (banco: Banco) => {
		api
			.delete(`/v1/bancos/${banco.idBanco}`)
			.then(() => {
				toast({ title: "Registro deletado com sucesso", action: <Check /> });
			})
			.finally(() => {
				handleFetch();
			});
	};
	const handleSubmit = () => {
		const postData = {
			nomeBanco: nome,
			codigoBanco: codigo,
			siteBanco: site,
		};

		api
			.post("/v1/bancos", postData)
			.then((data) => {
				toast({ title: data.data.mensagem, action: <Check /> });
			})
			.catch((data) => {
				toast({ title: data.response.data.mensagem ?? "Erro ao cadastrar banco", action: <CircleAlert /> });
			})
			.finally(() => {
				setOpen(false);
				handleFetch();
			});
	};
	return (
		<>
			<div>
				<Dialog
					open={open}
					onOpenChange={setOpen}
				>
					<DialogTrigger asChild>
						<Button className="mb-6">
							<Plus />
							Adicionar banco
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Cadastrar banco</DialogTitle>
							<DialogDescription>Preencha os campos a seguir para realizar o cadastro de um banco.</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-3 gap-2">
							<div className="col-span-2">
								<Label htmlFor="nome">Nome do banco</Label>
								<Input
									value={nome}
									id="nome"
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
								/>
							</div>
							<div className="col-span-1">
								<Label htmlFor="codigo">Código</Label>
								<Input
									value={codigo}
									id="codigo"
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCodigo(e.target.value)}
								/>
							</div>
							<div className="col-span-3">
								<Label htmlFor="site">Site</Label>
								<Input
									value={site}
									id="site"
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSite(e.target.value)}
								/>
							</div>
							<Button
								type="submit"
								onClick={handleSubmit}
								className="col-span-3 mt-4"
							>
								Adicionar
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<DataTableBancos
				isLoading={isLoading}
				columns={ColumnsBancos({
					onEdit: handleEdit,
					onDelete: handleDelete,
				})}
				data={bancos}
			/>
		</>
	);
};

export default Bancos;
