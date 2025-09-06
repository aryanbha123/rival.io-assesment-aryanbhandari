
export const bgGradient = (mode : string):string => { 
    return mode === 'dark'
      ? 'bg-gradient-to-r from-[#2c2c2c] to-[#1a1a1a]' // Dark mode gradient
      : 'bg-gradient-to-r from-[#667eea] to-[#764ba2]'; // Light mode gradient
}