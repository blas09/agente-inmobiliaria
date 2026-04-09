import type { Metadata } from "next";

import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
	title: "Agente Inmobiliaria",
	description: "SaaS multitenant para atención comercial inmobiliaria asistida por IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/15 selection:text-foreground">
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="agente-theme">
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
