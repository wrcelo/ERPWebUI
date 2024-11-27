import api from "@/api/api";
import LoadingComponentDetalheEmpresa from "@/components/custom/LoadingComponentDetalheEmpresa";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@radix-ui/react-separator";
import { Building2, Phone, Mail, Globe, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const DetalheEmpresa = () => {
	const params = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [empresa, setEmpresa] = useState({
		id: null,
		nome: "",
		cnpj: "",
		inscricaoEstadual: "",
		telefone: "",
		fax: "",
		email: "",
		site: "",
		observacao: null,
		endereco: {
			estado: "",
			cidade: "",
			bairro: "",
			logradouro: "",
			numero: "",
			complemento: "SALA 02",
			cep: "",
			uf: null,
		},
	});
	useEffect(() => {
		setIsLoading(true);
		api.get("/api/filial/v1/listar/id/" + params.id).then((data) => {
			setEmpresa(data.data);
			setIsLoading(false);
		});
	}, []);

	return (
		<div className="">
			{isLoading ? (
				<LoadingComponentDetalheEmpresa />
			) : (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building2 className="h-6 w-6" />
							<span>{empresa.nome}</span>
						</CardTitle>
						<div className="flex flex-wrap gap-2 mt-2">
							<Badge variant="secondary">CNPJ: {empresa.cnpj}</Badge>
							<Badge variant="secondary">IE: {empresa.inscricaoEstadual}</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<Tabs
							defaultValue="general"
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="general">Informações</TabsTrigger>
								<TabsTrigger value="address">Endereço</TabsTrigger>
							</TabsList>
							<TabsContent value="general">
								<div className="space-y-2 pt-6">
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<span>{empresa.telefone}</span>
									</div>
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4 text-muted-foreground" />
										<span>{empresa.email}</span>
									</div>
									{empresa.site && (
										<div className="flex items-center gap-2">
											<Globe className="h-4 w-4 text-muted-foreground" />
											<span>{empresa.site}</span>
										</div>
									)}
									{empresa.fax && (
										<div className="flex items-center gap-2">
											<Printer className="h-4 w-4 text-muted-foreground" />
											<span>Fax: {empresa.fax}</span>
										</div>
									)}
								</div>
							</TabsContent>
							<TabsContent value="address">
								<div className="space-y-2 pt-6">
									<div className="flex items-start gap-2">
										<div>
											<span>
												{empresa.endereco.logradouro}, {empresa.endereco.numero}
											</span>
											<span>{empresa.endereco.complemento}</span>
										</div>
									</div>
									<span>
										{empresa.endereco.bairro}, {empresa.endereco.cidade} - {empresa.endereco.estado}
									</span>
									<span>CEP: {empresa.endereco.cep}</span>
								</div>
							</TabsContent>
						</Tabs>

						{empresa.observacao && (
							<>
								<Separator className="my-4" />
								<section>
									<span className="mb-2">Observação</span>
									<span>{empresa.observacao}</span>
								</section>
							</>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};
