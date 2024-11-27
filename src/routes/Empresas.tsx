import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ColumnsEmpresas } from "@/lib/columns";
import { Empresa } from "@/lib/types";
import { Building2, Check, ListFilter, Plus, Unplug } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import api from "@/api/api";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const FormSchema = z.object({
	id: z.string(),
	nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
	cnpj: z.string().min(14, { message: "CNPJ deve ter 14 caracteres." }).max(18, { message: "CNPJ deve ter no máximo 18 caracteres." }),
	inscricao: z.string().optional(),
	cep: z.string().min(8, { message: "CEP deve ter 8 caracteres." }).max(10, { message: "CEO deve ter no máximo 10 caracteres" }),
	uf: z.string(),
	cidade: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres." }),
	bairro: z.string().min(2, { message: "Bairro deve ter pelo menos 2 caracteres." }),
	logradouro: z.string().min(2, { message: "Logradouro deve ter pelo menos 2 caracteres." }),
	numero: z.string().min(1, { message: "Número é obrigatório." }),
	complemento: z.string().optional(),
	email: z.string().email({ message: "E-mail inválido." }),
	telefone: z.string().min(10, { message: "Telefone deve ter no mínimo 10 caracteres." }),
	site: z.string({ message: "URL inválida." }).optional(),
});

const Empresas = () => {
	const [currentStep, setCurrentStep] = useState(1); // Controla a etapa atual do formulário
	const [data, setData] = useState<Empresa[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa>();

	const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 2)); // Limita a 2ª etapa
	const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1)); // Limita a 1ª etapa

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			id: "",
			nome: "",
			cnpj: "",
			inscricao: "",
			cep: "",
			uf: "",
			cidade: "",
			bairro: "",
			logradouro: "",
			numero: "",
			complemento: "",
			email: "",
			telefone: "",
			site: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		const postObject = {
			nome: data.nome,
			cnpj: {
				numeroCnpj: data.cnpj,
			},
			inscricaoEstadual: data.inscricao,
			telefone: data.telefone,
			fax: "",
			email: {
				enderecoEmail: data.email,
			},
			site: data.site,
			observacao: "",
			endereco: {
				estado: data.uf,
				cidade: data.cidade,
				bairro: data.bairro,
				logradouro: data.logradouro,
				numero: data.numero,
				complemento: data.complemento,
				cep: data.cep,
			},
		};

		api
			.post("api/filial/v1/cadastrar", postObject)
			.then(() => {
				toast({ title: "Empresa cadastrada com sucesso", action: <Check />, variant: "default" });
				handleFetch();
				setIsAddOpen(false);
			})
			.catch(() => {
				toast({
					title: "Falha ao cadastrar",
					description: "Houve um erro ao cadastrar uma empresa",
					variant: "destructive",
					action: <Unplug />,
				});
			});
	}

	function onEditSubmit(data: z.infer<typeof FormSchema>) {
		const postObject = {
			id: data.id,
			nome: data.nome || null,
			cnpj: data.cnpj ? { numeroCnpj: data.cnpj } : null,
			inscricaoEstadual: data.inscricao || null,
			telefone: data.telefone || null,
			fax: "",
			email: data.email ? { enderecoEmail: data.email } : null,
			site: data.site || null,
			observacao: "",
			endereco: {
				logradouro: data.logradouro || null,
				numero: data.numero || null,
				complemento: data.complemento || null,
				bairro: data.bairro || null,
				cidade: data.cidade || null,
				estado: data.uf || null,
				cep: data.cep || null,
			},
		};

		api
			.put("api/filial/v1/editar", postObject)
			.then(() => {
				toast({ title: "Empresa atualizada", description: `${postObject.nome} atualizado com sucesso!`, action: <Check /> });
				handleFetch();
			})
			.catch(() => {
				toast({
					title: "Falha ao editar",
					description: "Houve um erro ao editar a empresa.",
					variant: "destructive",
					action: <Unplug />,
				});
			});

		setIsEditOpen(false);
	}

	const handleFetch = () => {
		api.get("/api/filial/v1/listar").then((data) => {
			data.status == 200 ? setData(data.data) : console.error(data.data);
		});
	};

	useEffect(() => {
		handleFetch();
	}, []);

	const handleEdit = (empresa: Empresa) => {
		setIsEditOpen(true);
		if (empresa) {
			form.setValue("id", empresa.id);
			form.setValue("nome", empresa.nome ? empresa.nome : "");
			form.setValue("cnpj", empresa.cnpj ? empresa.cnpj : "");
			form.setValue("inscricao", empresa.inscricaoEstadual ? empresa.inscricaoEstadual : "");
			form.setValue("cep", empresa?.endereco?.cep ? empresa.endereco.cep : "");
			form.setValue("uf", empresa?.endereco?.uf ? empresa.endereco.uf : "");
			form.setValue("cidade", empresa?.endereco?.cidade ? empresa.endereco.cidade : "");
			form.setValue("bairro", empresa?.endereco?.bairro ? empresa.endereco.bairro : "");
			form.setValue("logradouro", empresa?.endereco?.logradouro ? empresa.endereco.logradouro : "");
			form.setValue("numero", empresa?.endereco?.numero ? empresa.endereco.numero : "");
			form.setValue("complemento", empresa?.endereco?.complemento ? empresa.endereco.complemento : "");
			form.setValue("email", empresa.email ? empresa.email : "");
			form.setValue("telefone", empresa.telefone ? empresa.telefone : "");
			form.setValue("site", empresa.site ? empresa.site : "");
		}
		setEmpresaSelecionada(empresa);
		setCurrentStep(1);
	};

	const handleDelete = (empresa: Empresa) => {
		api.delete("/api/filial/v1/excluir/id/" + empresa.id).then(() => {
			toast({ title: "Empresa excluída com sucesso", action: <Check />, variant: "default" });
			handleFetch();
		});
	};

	const handleBuscaEmpresas = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value == "") {
			handleFetch();
			return;
		}

		const searchTerm = event.target.value.toLowerCase();
		const filteredData = data.filter((empresa: any) => empresa.nome.toLowerCase().includes(searchTerm));
		setData(filteredData);
	};

	return (
		<>
			<Dialog
				open={isAddOpen}
				onOpenChange={setIsAddOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex gap-2 items-center">
							<Building2 className="w-4 h-4" />
							Adicionar
						</DialogTitle>
						<DialogDescription className="text-left">Adição de empresa</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="grid grid-cols-8 gap-4"
						>
							{/* Etapa 1 */}
							{currentStep === 1 && (
								<>
									<FormField
										control={form.control}
										name="nome"
										render={({ field }) => (
											<FormItem className="col-span-8">
												<FormLabel>Nome</FormLabel>
												<FormControl>
													<Input
														placeholder="Nome da empresa"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="cnpj"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>CNPJ</FormLabel>
												<FormControl>
													<Input
														placeholder="00.000.000/0000-00"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="inscricao"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>Inscrição</FormLabel>
												<FormControl>
													<Input
														placeholder="Inscrição estadual"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							{/* Etapa 2 */}
							{currentStep === 2 && (
								<>
									<FormField
										control={form.control}
										name="cep"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>CEP</FormLabel>
												<FormControl>
													<Input
														placeholder="00000-000"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="uf"
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormLabel>UF</FormLabel>
												<FormControl>
													<Input
														placeholder="ES"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="cidade"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Cidade</FormLabel>
												<FormControl>
													<Input
														placeholder="Vitória"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="bairro"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Bairro</FormLabel>
												<FormControl>
													<Input
														placeholder="Centro"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="logradouro"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Logradouro</FormLabel>
												<FormControl>
													<Input
														placeholder="Rua das Flores"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="numero"
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormLabel>Número</FormLabel>
												<FormControl>
													<Input
														placeholder="123"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="complemento"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Complemento</FormLabel>
												<FormControl>
													<Input
														placeholder="Apt 101"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="col-span-5">
												<FormLabel>E-mail</FormLabel>
												<FormControl>
													<Input
														placeholder="empresa@email.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="telefone"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>Telefone</FormLabel>
												<FormControl>
													<Input
														placeholder="(27) 99999-9999"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="site"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>Site</FormLabel>
												<FormControl>
													<Input
														placeholder="https://www.empresa.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							{/* Botões de navegação */}
							<div className="flex justify-between mt-4 col-span-8">
								{currentStep > 1 && (
									<Button
										variant={"outline"}
										onClick={handlePrevStep}
										className="w-24"
									>
										Voltar
									</Button>
								)}
								{currentStep < 2 ? (
									<div onClick={handleNextStep}>
										<Button
											variant={"outline"}
											onClick={handleNextStep}
											className="w-24"
										>
											Avançar
										</Button>
									</div>
								) : (
									<Button
										type="submit"
										className="w-24"
									>
										Adicionar
									</Button>
								)}
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
			<Dialog
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex gap-2 items-center">
							<Building2 className="w-4 h-4" />
							{empresaSelecionada?.nome}
						</DialogTitle>
						<DialogDescription className="text-left">Atualize os dados da empresa selecionada nos campos abaixo</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onEditSubmit)}
							className="grid grid-cols-8 gap-4"
						>
							{/* Etapa 1 */}
							{currentStep === 1 && (
								<>
									<FormField
										control={form.control}
										name="nome"
										render={({ field }) => (
											<FormItem className="col-span-8">
												<FormLabel>Nome</FormLabel>
												<FormControl>
													<Input
														placeholder="Nome da empresa"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="cnpj"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>CNPJ</FormLabel>
												<FormControl>
													<Input
														placeholder="00.000.000/0000-00"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="inscricao"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>Inscrição</FormLabel>
												<FormControl>
													<Input
														placeholder="Inscrição estadual"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							{/* Etapa 2 */}
							{currentStep === 2 && (
								<>
									<FormField
										control={form.control}
										name="cep"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>CEP</FormLabel>
												<FormControl>
													<Input
														placeholder="00000-000"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="uf"
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormLabel>UF</FormLabel>
												<FormControl>
													<Input
														placeholder="ES"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="cidade"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Cidade</FormLabel>
												<FormControl>
													<Input
														placeholder="Vitória"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="bairro"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Bairro</FormLabel>
												<FormControl>
													<Input
														placeholder="Centro"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="logradouro"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Logradouro</FormLabel>
												<FormControl>
													<Input
														placeholder="Rua das Flores"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="numero"
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormLabel>Número</FormLabel>
												<FormControl>
													<Input
														placeholder="123"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="complemento"
										render={({ field }) => (
											<FormItem className="col-span-3">
												<FormLabel>Complemento</FormLabel>
												<FormControl>
													<Input
														placeholder="Apt 101"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="col-span-5">
												<FormLabel>E-mail</FormLabel>
												<FormControl>
													<Input
														placeholder="empresa@email.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="telefone"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>Telefone</FormLabel>
												<FormControl>
													<Input
														placeholder="(27) 99999-9999"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="site"
										render={({ field }) => (
											<FormItem className="col-span-4">
												<FormLabel>Site</FormLabel>
												<FormControl>
													<Input
														placeholder="https://www.empresa.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							<div className="flex justify-between mt-4 col-span-8">
								{currentStep > 1 && (
									<Button
										type="button"
										onClick={handlePrevStep}
										className="w-24"
										variant={"outline"}
									>
										Voltar
									</Button>
								)}
								{currentStep < 2 ? (
									<div onClick={handleNextStep}>
										<Button
											variant={"outline"}
											className="w-24"
										>
											Avançar
										</Button>
									</div>
								) : (
									<Button
										type="submit"
										className=""
									>
										Atualizar
									</Button>
								)}
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<div className="mb-6 flex gap-2 justify-between">
				<div className="flex gap-2">
					<Button
						onClick={() => {
							setIsAddOpen(true);
							setCurrentStep(1);
							form.reset();
						}}
						className="gap-2"
					>
						<Plus className="w-4 h-4" />
						<div className="hidden lg:block ">Adicionar Empresa</div>
					</Button>
				</div>
				<div>
					<div className="flex w-full max-w-sm items-center space-x-2 lg:w-80">
						<Button
							className="gap-1"
							variant={"outline"}
						>
							<ListFilter className="w-4 h-4" />
							<div className="hidden lg:block">Filtrar</div>
						</Button>

						<Input
							type="text"
							placeholder="Buscar..."
							onInput={handleBuscaEmpresas}
						/>
					</div>
				</div>
			</div>
			<div>
				<DataTable
					columns={ColumnsEmpresas({
						onEdit: handleEdit,
						onDelete: handleDelete,
					})}
					data={data}
				/>
			</div>
		</>
	);
};

export default Empresas;
