import {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CurrencyProvider } from "./context/CurrencyContext";
import { SavingsGoalProvider } from "./context/SavingsGoalContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
   <StrictMode>
    <CurrencyProvider>
      <SavingsGoalProvider>
        <App />
      </SavingsGoalProvider>
    </CurrencyProvider>
  </StrictMode>
);
