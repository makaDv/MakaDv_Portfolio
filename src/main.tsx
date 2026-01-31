import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import initAntiDebug from "./lib/antiDebug";
import initObfuscate from "./lib/obfuscate";
import { I18nProvider } from "./i18n/i18n";
import ErrorBoundary from "./components/ErrorBoundary";

initAntiDebug();
initObfuscate();

createRoot(document.getElementById("root")!).render(
	<I18nProvider>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</I18nProvider>
);
