// Build-time render (scripts/prerender.js) so crawlers that don't run JS still see the page.
import { renderToString } from "react-dom/server";
import App from "./App";
import { BoostPage } from "./components/BoostPage";

export const renderHome = () => renderToString(<App />);
export const renderBoost = () => renderToString(<BoostPage onNavigate={() => {}} />);
