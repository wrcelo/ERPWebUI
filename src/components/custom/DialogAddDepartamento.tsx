import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/api/api";
import { toast } from "sonner";
import { Check } from "lucide-react";

const formSchema = z.object({
	nomeDepartamento: z.string().min(2, {
		message: "O nome do departamento deve ter pelo menos 2 caracteres.",
	}),
});

interface DialogAddDepartmentoProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (event: boolean) => void;
}

export function DialogAddDepartmento({ open, onOpenChange, onAdd }: DialogAddDepartmentoProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nomeDepartamento: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		api.post("/v1/departamentos", values).then((res) => {
			if (res.status == 201) {
				toast("Departamento criado!", {
					description: "Cadastro realizado com sucesso.",
					action: <Check />,
				});
				onAdd(true);
			}
		});
		onOpenChange(false);
		form.reset();
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Adicionar Departamento</DialogTitle>
					<DialogDescription>Preencha os detalhes do novo departamento aqui. Clique em salvar quando terminar.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="nomeDepartamento"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome do Departamento</FormLabel>
									<FormControl>
										<Input
											placeholder="Nome do departamento"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit">Salvar Departamento</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
