// Dashboard.tsx
import React from 'react';
import DashboardContent from '../components/dashboard/DashboardContent';
import DashboardHeader from '../components/layout/DashboardHeader';
import { useThemeMode } from '../context/ThemeContext';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
  const { mode } = useThemeMode();

  // Choose gradient based on theme
  const gradientClass =
    mode === 'dark'
      ? 'bg-gradient-to-br from-[#1f1f1f] to-[#3a3a3a]' // Dark mode gradient
      : 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'; // Light mode gradient

  return (
    <>
      <main className={`p-5 ${gradientClass}`}>
        <section className="max-w-[1440px] mx-auto bg-white dark:bg-[#1f1f1f] rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Header */}
          <DashboardHeader />
          {/* Body */}
          <DashboardContent />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
