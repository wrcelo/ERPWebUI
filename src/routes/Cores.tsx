import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cor } from "@/lib/types";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import ColorPicker, { Color } from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";
import { PaintBucket, Pencil, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";

const Cores = () => {
	useEffect(() => {
		handleFetch();
	}, []);

	const [cor, setCor] = useState("#ffffff");
	const [nomeCor, setNomeCor] = useState("");
	const [coresCadastradas, setCoresCadastradas] = useState<Cor[]>([]);

	const handleChange = (value: Color) => {
		setCor(value.toHexString());
	};
	const handleNomeCor = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNomeCor(e.target.value);
	};

	const handleFetch = () => {
		api.get("/v1/cores").then((data) => {
			setCoresCadastradas(data.data.dados);
		});
	};

	return (
		<div>
			<div className="grid grid-cols-1 gap-2 mb-6">
				<ColorPicker
					disabledAlpha={true}
					onChange={handleChange}
					value={cor}
					className="!shadow-none !w-full !bg-transparent !p-0"
				/>
				<div className="grid grid-cols-10 gap-2">
					<Input
						className="col-span-7"
						onChange={handleNomeCor}
						placeholder="Digite o nome da cor"
						value={nomeCor}
					/>
					<Input
						className="col-span-3 text-sm uppercase"
						value={cor}
						readOnly
						type="text"
					/>
					<Button
						type="submit"
						className="col-span-10"
					>
						<PaintBucket />
						Adicionar
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-2 overflow-scroll">
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
								<Pencil className="w-4 h-4" />
								<Trash className="w-4 h-4 text-destructive" />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Cores;
