import type { Route } from "./+types/home";
import { HomePage } from "../pages/HomePage";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Topshots" },
		{ name: "description", content: "Imagerie par drône en région Auvergne-Rhône-Alpes" },
	];
}

export default function Home() {
	return (
		<HomePage />
	)
}
