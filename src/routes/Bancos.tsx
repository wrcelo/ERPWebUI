import api from "@/api/api";
import { DataTableBancos } from "@/components/custom/DataTableBancos";
import { ColumnsBancos } from "@/lib/columns";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { toast } from "sonner";
import { Check, CircleAlert, Plus, SearchIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Banco } from "@/lib/types";

const Bancos = () => {
	useEffect(() => {
		handleFetch();
	}, []);

	const [bancos, setBancos] = useState([]);
	const [filteredBancos, setFilteredBancos] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [nome, setNome] = useState("");
	const [codigo, setCodigo] = useState("");
	const [site, setSite] = useState("");
	const [nomeEdit] = useState("");
	const [codigoEdit] = useState("");
	const [siteEdit] = useState("");
	const [open, setOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleFetch = () => {
		setIsLoading(true);
		api
			.get("/v1/bancos")
			.then((data) => {
				const bancosData = data.data.dados;
				setBancos(bancosData);
				setFilteredBancos(bancosData);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	// Função para filtrar bancos com base na query de busca
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);

		if (!query.trim()) {
			setFilteredBancos(bancos);
		} else {
			const filtered = bancos.filter((banco: Banco) => banco.nomeBanco.toLowerCase().includes(query) || banco.codigoBanco.toLowerCase().includes(query));
			setFilteredBancos(filtered);
		}
	};

	// Limpar busca
	const clearSearch = () => {
		setSearchQuery("");
		setFilteredBancos(bancos);
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
				toast("Registro atualizado com sucesso", { action: <Check /> });
			})
			.finally(() => {
				handleFetch();
			});
	};

	const handleDelete = (banco: Banco) => {
		api
			.delete(`/v1/bancos/${banco.idBanco}`)
			.then(() => {
				toast("Registro deletado com sucesso", { action: <Check /> });
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
				toast(data.data.mensagem, { action: <Check /> });
			})
			.catch((data) => {
				toast.error(data.response.data.mensagem ?? "Erro ao cadastrar banco", { action: <CircleAlert /> });
			})
			.finally(() => {
				setOpen(false);
				handleFetch();
			});
	};

	return (
		<>
			<div className="mb-6 flex items-center">
				<Dialog
					open={open}
					onOpenChange={setOpen}
				>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							<span className="hidden md:inline">Adicionar banco</span>
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

				<div className="flex w-full max-w-sm items-center space-x-2 relative ">
					<Input
						type="text"
						placeholder="Buscar banco..."
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

			<DataTableBancos
				isLoading={isLoading}
				columns={ColumnsBancos({
					onEdit: handleEdit,
					onDelete: handleDelete,
				})}
				data={filteredBancos}
			/>

			{!isLoading && filteredBancos.length === 0 && (
				<div className="flex flex-col items-center justify-center py-8 text-center">
					<XCircle className="w-10 h-10 text-muted-foreground mb-2" />
					<p className="text-muted-foreground">{searchQuery ? `Nenhum banco encontrado com "${searchQuery}"` : "Nenhum banco cadastrado"}</p>
				</div>
			)}
		</>
	);
};

export default Bancos;
