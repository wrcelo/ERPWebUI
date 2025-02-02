import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Cor } from "@/lib/types";
import { Check, PaintBucket, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Cores = () => {
	useEffect(() => {
		handleFetch();
	}, []);

	const [openEdit, setOpenEdit] = useState(false);
	const [idCorEdit, setIdCorEdit] = useState<string>("");
	const [codigoCor, setCodigoCor] = useState("");
	const [nomeCor, setNomeCor] = useState("");
	const [descricaoCor, setDescricaoCor] = useState("");
	const [coresCadastradas, setCoresCadastradas] = useState<Cor[]>([]);
	const [codigoCorEdit, setCodigoCorEdit] = useState("");
	const [nomeCorEdit, setNomeCorEdit] = useState("");
	const [descricaoCorEdit, setDescricaoCorEdit] = useState("");
	const [todasCores, setTodasCores] = useState<Cor[]>([]);

	const handleCodigoCor = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCodigoCor(e.target.value);
	};
	const handleNomeCor = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNomeCor(e.target.value);
	};
	const handleDescricaoCor = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescricaoCor(e.target.value);
	};

	const handleCodigoCorEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCodigoCorEdit(e.target.value);
	};
	const handleNomeCorEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNomeCorEdit(e.target.value);
	};
	const handleDescricaoCorEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescricaoCorEdit(e.target.value);
	};

	const handleBuscaNome = (e: React.ChangeEvent<HTMLInputElement>) => {
		const termoBusca = e.target.value.toLowerCase();

		if (!termoBusca) {
			setCoresCadastradas(todasCores);
			return;
		}

		setCoresCadastradas(todasCores.filter((cor) => cor.nomeCor.toLowerCase().includes(termoBusca)));
	};

	const handleBuscaCod = (e: React.ChangeEvent<HTMLInputElement>) => {
		const termoBusca = e.target.value.toLowerCase();

		if (!termoBusca) {
			setCoresCadastradas(todasCores);
			return;
		}

		setCoresCadastradas(todasCores.filter((cor) => cor.codigoCor.toLowerCase().includes(termoBusca)));
	};

	const handleFetch = async () => {
		try {
			const { data } = await api.get("/v1/cores");
			setCoresCadastradas(data.dados);
			setTodasCores(data.dados);
		} catch (error) {
			toast({ title: "Erro ao carregar cores", action: <Check /> });
		}
	};

	const handleSubmit = () => {
		let postData = {
			nomeCor: nomeCor,
			descricaoCor: descricaoCor,
			codigoCor: codigoCor,
		};
		api.post("/v1/cores", postData).then((data) => {
			toast({ title: data.data.mensagem, action: <Check /> });
			handleFetch();
		});
	};

	const handleSubmitEdit = () => {
		let putData = {
			nomeCor: nomeCorEdit,
			descricaoCor: descricaoCorEdit,
			codigoCor: codigoCorEdit,
		};
		api
			.put(`/v1/cores/${idCorEdit}`, putData)
			.then((data) => {
				toast({ title: data.data.mensagem, action: <Check /> });
			})
			.catch((data) => {
				toast({ title: data.data.mensagem, action: <Check /> });
			})
			.finally(() => {
				setOpenEdit(false);
				handleFetch();
			});
	};

	const handleEdit = (cor: Cor) => {
		setOpenEdit(true);
		setCodigoCorEdit(cor.codigoCor);
		setNomeCorEdit(cor.nomeCor);
		setDescricaoCorEdit(cor.descricaoCor);
		setIdCorEdit(cor.idCor);
	};

	const handleDelete = (cor: Cor) => {
		setIdCorEdit(cor.idCor);
	};

	const handleSubmitDelete = () => {
		api
			.delete(`/v1/cores/${idCorEdit}`)
			.then((data) => {
				toast({ title: data.data.mensagem, action: <Check /> });
			})
			.catch((data) => {
				toast({ title: data.data.mensagem, action: <Check /> });
			})
			.finally(() => {
				handleFetch();
			});
	};

	return (
		<div>
			<div className="grid grid-cols-1 gap-2 mb-10">
				<div className="grid grid-cols-10 gap-2">
					<Input
						className="col-span-7"
						onChange={handleNomeCor}
						placeholder="Nome da cor"
						value={nomeCor}
					/>
					<Input
						className="col-span-3"
						onChange={handleCodigoCor}
						placeholder="Código"
						value={codigoCor}
					/>
					<Textarea
						className="col-span-10"
						onChange={handleDescricaoCor}
						placeholder="Descrição"
						value={descricaoCor}
					/>
					<Button
						type="submit"
						className="col-span-10"
						onClick={handleSubmit}
					>
						<PaintBucket />
						Adicionar
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-2">
				<h2 className="text-2xl">Cores</h2>
				<div className="grid grid-cols-5 gap-2">
					<h3 className="col-span-5">Buscar cor</h3>
					<Input
						className="mb-4 col-span-4"
						placeholder="Nome"
						onChange={handleBuscaNome}
					/>
					<Input
						className="col-span-1"
						placeholder="Cod"
						onChange={handleBuscaCod}
					/>
				</div>
				{coresCadastradas.map((cor) => {
					return (
						<div
							key={cor.idCor}
							className="border-b pt-1 pb-3 flex justify-between"
						>
							<div className="flex flex-col">
								<span>{cor.nomeCor}</span>
								<span className="text-xs text-secondary-foreground">{cor.codigoCor}</span>
							</div>
							<div className="flex gap-2 items-center">
								<Button
									size={"icon"}
									variant={"outline"}
									onClick={() => handleEdit(cor)}
								>
									<Pencil className="w-4 h-4" />
								</Button>

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											onClick={() => handleDelete(cor)}
											size={"icon"}
											variant={"outline"}
											className="border-destructive"
										>
											<Trash className="w-4 h-4 text-destructive" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
											<AlertDialogDescription>Essa ação irá deletar essa cor permanentemente</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction onClick={handleSubmitDelete}>Sim, quero deletar</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					);
				})}
			</div>
			<Dialog
				open={openEdit}
				onOpenChange={setOpenEdit}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{nomeCorEdit}</DialogTitle>
						<DialogDescription>Edite as informações cadastradas para a cor selecionada</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<Input
							className="col-span-7"
							onChange={handleNomeCorEdit}
							type="text"
							value={nomeCorEdit}
						/>
						<Input
							className="col-span-3"
							onChange={handleCodigoCorEdit}
							value={codigoCorEdit}
						/>
						<Textarea
							className="col-span-10"
							onChange={handleDescricaoCorEdit}
							value={descricaoCorEdit == null ? "" : descricaoCorEdit}
						/>
						<Button
							type="submit"
							className="col-span-10"
							onClick={handleSubmitEdit}
						>
							Salvar alterações
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Cores;
