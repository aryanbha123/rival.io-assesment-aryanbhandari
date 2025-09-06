// App.tsx
import React, { lazy, Suspense } from "react";
import { ThemeModeProvider, useThemeMode } from "./context/ThemeContext";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Dashboard = lazy(() => import("./pages/Dashboard"));

function ThemeToggleButton() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <IconButton onClick={toggleMode}>
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </div>
  );
}

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
