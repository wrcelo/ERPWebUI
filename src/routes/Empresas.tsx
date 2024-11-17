import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ColumnsEmpresas } from "@/lib/columns";
import { Empresa } from "@/lib/types";
import { Building2, ListFilter, PlusCircle, Unplug } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import DialogConfirmAlert from "@/components/custom/DialogConfirmAlert";
import axios from "axios";

const FormSchema = z.object({
	nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
	cnpj: z.string().length(14, { message: "CNPJ deve ter 14 caracteres." }),
	inscricao: z.string().optional(),
	cep: z.string().length(8, { message: "CEP deve ter 8 caracteres." }),
	uf: z.string().length(2, { message: "UF deve ter 2 caracteres." }),
	cidade: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres." }),
	bairro: z.string().min(2, { message: "Bairro deve ter pelo menos 2 caracteres." }),
	logradouro: z.string().min(2, { message: "Logradouro deve ter pelo menos 2 caracteres." }),
	numero: z.string().min(1, { message: "Número é obrigatório." }),
	complemento: z.string().optional(),
	email: z.string().email({ message: "E-mail inválido." }),
	telefone: z.string().min(10, { message: "Telefone deve ter no mínimo 10 caracteres." }),
	site: z.string({ message: "URL inválida." }).optional(),
});

const dados: Empresa[] = [
	{
		id: "1",
		imgUrl: "https://www.intermercados.com.br/wp-content/uploads/2018/07/fachada-de-empresa.jpg",
		nome: "Empresa Alpha",
		cnpj: "12345678001",
		inscricaoEstadual: "1234567890",
		telefone: "(11) 1234-5678",
		fax: "(11) 8765-4321",
		email: "contato@empresaalpha.com",
		site: "www.empresaalpha.com",
		instagram: "@empresaalpha",
		observacao: "Empresa líder em soluções tecnológicas.",
		endereco: {
			estado: "SP",
			cidade: "São Paulo",
			bairro: "Centro",
			logradouro: "Rua Alfa",
			numero: "100",
			complemento: "Sala 5",
			cep: "01000-000",
		},
	},
	{
		id: "2",
		imgUrl: "https://carvalhoprintoffice.com.br/wp-content/uploads/2020/09/revestimento-acm-fachada.jpg",
		nome: "Empresa Beta",
		cnpj: "98765432001",
		inscricaoEstadual: "0987654321",
		telefone: "(21) 2345-6789",
		fax: "(21) 9876-5432",
		email: "contato@empresabeta.com",
		site: "www.empresabeta.com",
		instagram: "@empresabeta",
		observacao: "Especializada em consultoria empresarial.",
		endereco: {
			estado: "RJ",
			cidade: "Rio de Janeiro",
			bairro: "Copacabana",
			logradouro: "Avenida Atlântica",
			numero: "200",
			complemento: "Cobertura",
			cep: "22000-000",
		},
	},
	{
		id: "3",
		imgUrl: "https://comunicacao.hdvisual.net/imagens/empresa-de-fachada-loja.jpg",
		nome: "Empresa Gamma",
		cnpj: "19283746001",
		inscricaoEstadual: "1928374654",
		telefone: "(31) 3456-7890",
		fax: "(31) 6543-2109",
		email: "contato@empresagamma.com",
		site: "www.empresagamma.com",
		instagram: "@empresagamma",
		observacao: "Foco em inovação e desenvolvimento de software.",
		endereco: {
			estado: "MG",
			cidade: "Belo Horizonte",
			bairro: "Savassi",
			logradouro: "Rua Gamma",
			numero: "300",
			complemento: "Andar 2",
			cep: "30100-000",
		},
	},
	{
		id: "4",
		imgUrl: "https://aaxesquadrias.com.br/wp-content/uploads/2021/07/1640f-fachada-pele-de-vidro-3.jpg",
		nome: "Empresa Delta",
		cnpj: "56473829001",
		inscricaoEstadual: "5647382910",
		telefone: "(41) 4567-8901",
		fax: "(41) 1098-7654",
		email: "contato@empresadelta.com",
		site: "www.empresadelta.com",
		instagram: "@empresadelta",
		observacao: "Empresa com foco em logística e transporte.",
		endereco: {
			estado: "PR",
			cidade: "Curitiba",
			bairro: "Batel",
			logradouro: "Rua Delta",
			numero: "400",
			complemento: "Loja A",
			cep: "80200-000",
		},
	},
	{
		id: "5",
		imgUrl: "https://static9.depositphotos.com/1279189/1195/i/450/depositphotos_11956071-stock-photo-modern-business-unit.jpg",
		nome: "Empresa Epsilon",
		cnpj: "10293847561",
		inscricaoEstadual: "1029384765",
		telefone: "(51) 5678-9012",
		fax: "(51) 2109-8765",
		email: "contato@empresaepsilon.com",
		site: "www.empresaepsilon.com",
		instagram: "@empresaepsilon",
		observacao: "Empresa atuando no setor agrícola.",
		endereco: {
			estado: "RS",
			cidade: "Porto Alegre",
			bairro: "Moinhos de Vento",
			logradouro: "Rua Epsilon",
			numero: "500",
			complemento: "Casa",
			cep: "90000-000",
		},
	},
	{
		id: "2",
		imgUrl: "https://carvalhoprintoffice.com.br/wp-content/uploads/2020/09/revestimento-acm-fachada.jpg",
		nome: "Empresa Beta",
		cnpj: "98765432001",
		inscricaoEstadual: "0987654321",
		telefone: "(21) 2345-6789",
		fax: "(21) 9876-5432",
		email: "contato@empresabeta.com",
		site: "www.empresabeta.com",
		instagram: "@empresabeta",
		observacao: "Especializada em consultoria empresarial.",
		endereco: {
			estado: "RJ",
			cidade: "Rio de Janeiro",
			bairro: "Copacabana",
			logradouro: "Avenida Atlântica",
			numero: "200",
			complemento: "Cobertura",
			cep: "22000-000",
		},
	},
];

const Empresas = () => {
	const [data, setData] = useState<Empresa[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa>();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
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

		axios
			.post("https://localhost:5001/api/filial/v1/cadastrar", postObject)
			.then(() => {
				toast({ title: "Empresa cadastrada com sucesso" });
			})
			.catch(() => {
				toast({
					title: "Falha ao cadastrar",
					description: "Houve um erro ao cadastrar uma empresa",
					variant: "destructive",
					action: <Unplug />,
				});
			});

		setIsEditOpen(false);
	}

	const handleFetch = () => {
		setData(dados);
	};

	useEffect(() => {
		handleFetch();
	}, []);

	const handleEdit = (empresa: Empresa) => {
		setIsEditOpen(true);
		if (empresa) {
			form.setValue("nome", empresa.nome ? empresa.nome : "");
			form.setValue("cnpj", empresa.cnpj ? empresa.cnpj : "");
			form.setValue("inscricao", empresa.inscricaoEstadual ? empresa.inscricaoEstadual : "");
			form.setValue("cep", empresa?.endereco?.cep ? empresa.endereco.cep : "");
			form.setValue("uf", empresa?.endereco?.estado ? empresa.endereco.estado : "");
			form.setValue("cidade", empresa?.endereco?.cidade ? empresa.endereco.cidade : "");
			form.setValue("bairro", empresa?.endereco?.bairro ? empresa.endereco.bairro : "");
			form.setValue("logradouro", empresa?.endereco?.logradouro ? empresa.endereco.logradouro : "");
			form.setValue("numero", empresa?.endereco?.numero ? empresa.endereco.numero : "");
			form.setValue("complemento", empresa?.endereco?.complemento ? empresa.endereco.complemento : "");
			form.setValue("email", empresa.email ? empresa.email : "");
			form.setValue("telefone", empresa.telefone ? empresa.telefone : "");
			form.setValue("site", empresa.site ? empresa.site : "");
		}
	};

	const handleDelete = (empresa: Empresa) => {};
	const handleDetalhes = (empresa: Empresa) => {};
	const handleBuscaEmpresas = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = event.target.value.toLowerCase();
		const filteredData = dados.filter((empresa: any) => empresa.nome.toLowerCase().includes(searchTerm));
		setData(filteredData);
	};

	return (
		<>
			<Dialog
				open={isAddOpen}
				onOpenChange={setIsAddOpen}
			>
				<DialogContent className="">
					<DialogHeader>
						<DialogTitle className="flex gap-2 items-center">
							<Building2 className="w-4 h-4" />
							Adicionar Empresa
						</DialogTitle>
						<DialogDescription className="text-left">Realize o cadastro de empresas</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="grid grid-cols-8 gap-4"
						>
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
							<Button
								type="submit"
								className="col-span-8 mt-4"
							>
								Cadastrar
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			>
				<DialogContent className="">
					<DialogHeader>
						<DialogTitle className="flex gap-2 items-center">
							<Building2 className="w-4 h-4" />
							Editar {empresaSelecionada?.nome}
						</DialogTitle>
						<DialogDescription className="text-left">Edição de empresa</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="grid grid-cols-8 gap-4"
						>
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
							<DialogConfirmAlert
								title={"Cadastro de empresa"}
								description={"Tem certeza que deseja cadastrar essa empresa?"}
							>
								<Button
									type="submit"
									className="col-span-8 mt-4"
								>
									Editar
								</Button>
							</DialogConfirmAlert>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<div className="mb-4 flex gap-2 justify-between">
				<div className="flex gap-2">
					<Button
						onClick={() => {
							setIsAddOpen(true);
							form.reset();
						}}
						className="gap-1"
					>
						<PlusCircle className="w-4 h-4" />
						<div className="hidden lg:block ">Adicionar</div>
					</Button>
					{/* <Button
						className="gap-1"
						variant={"outline"}
					>
						<ListFilter className="w-4 h-4" />
						<div className="hidden lg:block">Filtrar</div>
					</Button> */}
				</div>
				<div>
					<div className="flex w-full max-w-sm items-center space-x-2">
						<Input
							type="text"
							placeholder="Buscar..."
							onInput={handleBuscaEmpresas}
						/>
					</div>
				</div>
			</div>
			<div className="p-8 rounded-sm bg-background border ">
				<DataTable
					columns={ColumnsEmpresas({ onEdit: handleEdit, onDelete: handleDelete })}
					data={data}
				/>
			</div>
		</>
	);
};

export default Empresas;
