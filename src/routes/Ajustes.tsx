import { useTheme } from "@/components/custom/ThemeProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Ajustes = () => {
	const { setTheme, theme } = useTheme();
	return (
		<>
			<div className="mb-8">
				<h1 className="text-2xl font-semibold mb-1">Ajustes</h1>
				<p className="text-muted-foreground ">Configurações do sistema e gerencie os membros da equipe</p>
			</div>
			<div className="grid grid-cols-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-xl">Sistema</CardTitle>
						<CardDescription>Ajustes relacionado ao sistema</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<Switch
								checked={theme == "dark"}
								onCheckedChange={() => setTheme(theme == "dark" ? "light" : "dark")}
							/>
							<span>Modo escuro</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default Ajustes;
