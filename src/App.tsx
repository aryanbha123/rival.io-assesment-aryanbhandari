// App.tsx
import  { lazy, Suspense } from "react";
import { ThemeModeProvider } from "./context/ThemeContext";


const Dashboard = lazy(() => import("./pages/Dashboard"));


export default function App() {
  return (
    <ThemeModeProvider>
      {/* <ThemeToggleButton /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </ThemeModeProvider>
  );
}
