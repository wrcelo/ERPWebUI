import { SearchX } from "lucide-react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<div className="w-screen h-screen flex justify-center items-center gap-2">
			<SearchX />
			<span>Essa página não foi encontrada</span>
		</div>
	);
}
