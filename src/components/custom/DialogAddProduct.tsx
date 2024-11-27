import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	nome: z.string().min(2, {
		message: "O nome do produto deve ter pelo menos 2 caracteres.",
	}),
	descricao: z.string().min(10, {
		message: "A descrição deve ter pelo menos 10 caracteres.",
	}),
	estoqueEmMetros: z.number().min(0, {
		message: "O estoque deve ser um número positivo.",
	}),
	imgFile: z.instanceof(File).refine((file) => file.size > 0, {
		message: "Por favor, selecione um arquivo de imagem.",
	}),
});

interface DialogAddProductProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DialogAddProduct({ open, onOpenChange }: DialogAddProductProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: "",
			descricao: "",
			estoqueEmMetros: 0,
			imgFile: undefined,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Processar o envio do arquivo e os outros dados do formulário
		const formData = new FormData();
		formData.append("nome", values.nome);
		formData.append("descricao", values.descricao);
		formData.append("estoqueEmMetros", values.estoqueEmMetros.toString());
		formData.append("imgFile", values.imgFile);

		// Substitua por uma chamada à API para envio
		console.log("Dados enviados:", formData);

		onOpenChange(false);
		form.reset();
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Adicionar Produto</DialogTitle>
					<DialogDescription>Preencha os detalhes do novo produto aqui. Clique em salvar quando terminar.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="nome"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input
											placeholder="Nome do produto"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="descricao"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input
											placeholder="Descreva o produto"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="estoqueEmMetros"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Estoque (em metros)</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="imgFile"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Imagem</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													field.onChange(file);
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit">Salvar Produto</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
