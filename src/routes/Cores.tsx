import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Cor } from "@/lib/types";
import { Check, PaintBucket, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

	const [openEdit, setOpenEdit] = useState<boolean>(false);
	const [idCorEdit, setIdCorEdit] = useState<string>("");
	const [codigoCor, setCodigoCor] = useState("");
	const [nomeCor, setNomeCor] = useState("");
	const [descricaoCor, setDescricaoCor] = useState("");
	const [coresCadastradas, setCoresCadastradas] = useState<Cor[]>([]);
	const [codigoCorEdit, setCodigoCorEdit] = useState("");
	const [nomeCorEdit, setNomeCorEdit] = useState("");
	const [descricaoCorEdit, setDescricaoCorEdit] = useState("");
	const [todasCores, setTodasCores] = useState<Cor[]>([]);
	const [openAdicionar, setOpenAdicionar] = useState<boolean>(false);

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
		api
			.post("/v1/cores", postData)
			.then((data) => {
				toast({ title: data.data.mensagem, action: <Check /> });
				handleFetch();
			})
			.finally(() => {
				setOpenAdicionar(false);
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
		<div className="">
			<div className="grid grid-cols-1 gap-2">
				<div className="flex justify-between gap-6">
					<div>
						<Dialog
							open={openAdicionar}
							onOpenChange={setOpenAdicionar}
						>
							<DialogTrigger asChild>
								<Button>
									<Plus />
									<span className="hidden lg:block">Adicionar cor</span>
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Adicionar cor</DialogTitle>
									<DialogDescription>Cadastre uma cor</DialogDescription>
									<DialogContent>
										<div className="grid grid-cols-10 gap-2 lg:flex lg:flex-col lg:w-full">
											<h3 className="col-span-5 text-xl">Adicionar cor</h3>

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
									</DialogContent>
								</DialogHeader>
							</DialogContent>
						</Dialog>
					</div>
					<div className="flex gap-2">
						<Input
							className="mb-4 w-3/4"
							placeholder="Buscar por nome"
							onChange={handleBuscaNome}
						/>
						<Input
							className="w-1/4"
							placeholder="Cód"
							onChange={handleBuscaCod}
						/>
					</div>
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
			{/* <div className="flex grid-cols-1 gap-2 mb-10 lg:w-1/3"></div> */}

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
