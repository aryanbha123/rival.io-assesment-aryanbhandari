import React, { useState } from 'react';
import ContentTable from './content/ContentTable';
import { useThemeMode } from '../../context/ThemeContext';

interface Statistics {
  label: string;
  stat: number;
  verdict: string;
  trend: 'positive' | 'negative' | 'neutral';
}

const getSymbol = (trend: 'positive' | 'negative' | 'neutral'): string => {
  switch (trend) {
    case 'positive':
      return '↑';
    case 'negative':
      return '↓';
    case 'neutral':
      return '→';
    default:
      return '';
  }
}

const Content: Statistics[] = [
  {
    label: 'Active Projects',
    stat: 24,
    verdict: '12% from last month',
    trend: 'positive',
  },
  {
    label: 'Total Tasks',
    stat: 156,
    verdict: '8% from last month',
    trend: 'positive',
  },
  {
    label: 'Team Members',
    stat: 43,
    verdict: 'No change',
    trend: 'neutral',
  },
  {
    label: 'Completion Rate',
    stat: 87,
    verdict: '5% from last month',
    trend: 'negative',
  },
];

const DashboardContent: React.FC = () => {
  const [active, setActive] = useState<string>('Active Projects');
  const { mode } = useThemeMode();

  // Text colors based on trend
  const trendColors: Record<'positive' | 'negative' | 'neutral', string> = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: mode === 'dark' ? 'text-gray-400' : 'text-gray-500',
  };

  return (
    <section className={`rounded-b-xl p-8 ${mode === 'dark' ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
      <div className='flex justify-evenly gap-6'>
        {Content.map((item, index) => {
          const isActive = active === item.label;

          const activeBg = mode === 'dark'
            ? 'bg-gradient-to-br from-[#333333] to-[#1a1a1a] text-white'
            : 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white';

          const inactiveBg = mode === 'dark'
            ? 'bg-[#2a2a2a] text-gray-300'
            : 'bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)]';

          return (
            <div
              key={index}
              onClick={() => setActive(item.label)}
              className={`cursor-pointer flex flex-col items-start justify-center w-full rounded-2xl p-5 transition-all ${
                isActive ? activeBg : inactiveBg
              }`}
            >
              {/* Label */}
              <span className='text-[12px] uppercase tracking-[1px] opacity-80'>
                {item.label}
              </span>

              {/* Stat */}
              <span className='text-[28px] font-bold'>{item.stat}</span>

              {/* Verdict with arrow */}
              <span className={`text-xs font-medium ${trendColors[item.trend]}`}>
                {getSymbol(item.trend)} {item.verdict}
              </span>
            </div>
          );
        })}
      </div>
      <ContentTable />
    </section>
  );
};

export default DashboardContent;
