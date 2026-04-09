import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
	title: "Agente Inmobiliaria",
	description: "SaaS multitenant para atención comercial inmobiliaria asistida por IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<body className="min-h-screen bg-background font-sans text-foreground antialiased">
				{children}
			</body>
		</html>
	);
}
