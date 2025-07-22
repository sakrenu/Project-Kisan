module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3A5F0B',
            dark: '#2C4A08'
          },
          secondary: '#8B4513',
          accent: '#FFD700',
          background: '#F5DEB3',
          sky: '#87CEEB',
          success: '#4CAF50'
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }