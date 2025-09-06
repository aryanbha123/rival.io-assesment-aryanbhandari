import { Avatar, IconButton } from '@mui/material';
import type React from 'react';
import { useThemeMode } from '../../context/ThemeContext';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const DashboardHeader: React.FC<{}> = () => {
  const { mode, toggleMode } = useThemeMode();

  // Gradient for header based on theme
  const headerGradient =
    mode === 'dark'
      ? 'bg-gradient-to-r from-[#2c2c2c] to-[#1a1a1a]' // Dark mode gradient
      : 'bg-gradient-to-r from-[#667eea] to-[#764ba2]'; // Light mode gradient

  // Avatar colors for dark mode
  const avatarBg = mode === 'dark' ? '#3a3a3a' : 'white';
  const avatarColor = mode === 'dark' ? '#a3a3a3' : '#667eea';

  // Text color for title
  const titleColor = mode === 'dark' ? 'text-gray-200' : 'text-white';

  return (
    <section className={`flex rounded-t-xl p-6 px-8 justify-between ${headerGradient}`}>
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <div
          className='w-10 h-10 rounded-[10px] flex items-center justify-center font-bold'
          style={{ backgroundColor: avatarBg, color: avatarColor }}
        >
          TF
        </div>
        <h2 className={`text-2xl font-bold ${titleColor}`}>TaskFlow Pro</h2>
      </div>

      <div className='flex justify-end gap-3'>
        <IconButton onClick={toggleMode}>
          {mode !== 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
        <Avatar
          sx={{
            bgcolor: avatarBg,
            color: avatarColor,
            fontSize: '12px',
            fontWeight: 'bold',
            width: 40,
            height: 40,
          }}
        >
          AB
        </Avatar>
      </div>
    </section>
  );
};

export default DashboardHeader;
