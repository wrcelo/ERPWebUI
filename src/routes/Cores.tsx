import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import ColorPicker, { Color } from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";
import { PaintBucket, PlusCircle } from "lucide-react";
import { useState } from "react";

const Cores = () => {
	const [cor, setCor] = useState("#ffffff");
	const [nomeCor, setNomeCor] = useState("");

	const handleChange = (value: Color) => {
		setCor(value.toHexString());
	};
	const handleNomeCor = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNomeCor(e.target.value);
	};

	return (
		<div className="grid grid-cols-1 gap-2">
			<ColorPicker
				disabledAlpha={true}
				onChange={handleChange}
				value={cor}
				className="!shadow-none !w-full !bg-transparent !p-0 !mb-5"
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
	);
};

export default Cores;
