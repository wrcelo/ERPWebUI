import { Skeleton } from "../ui/skeleton";
import { Card, CardHeader } from "../ui/card";

const LoadingComponentDetalheEmpresa = () => {
	return (
		<Card>
			<CardHeader>
				<div className="flex gap-2">
					<Skeleton className="aspect-square h-4" />
					<Skeleton className="w-[300px] h-4" />
				</div>
				<div className="flex gap-2 pb-4">
					<Skeleton className="w-[140px] h-3" />
					<Skeleton className="w-[200px] h-3" />
				</div>
				<div className="pb-4">
					<Skeleton className="w-full h-6" />
				</div>
				<div className="flex flex-col gap-2">
					<Skeleton className="w-[100px] h-3" />
					<Skeleton className="w-[100px] h-3" />
					<Skeleton className="w-12 h-3" />
				</div>
			</CardHeader>
		</Card>
	);
};

export default LoadingComponentDetalheEmpresa;
