/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F6F2",
        panel: "#FFFFFF",
        ink: "#171B21",
        subink: "#5B6270",
        line: "#DEDFD8",
        blueprint: {
          DEFAULT: "#2B4C7E",
          light: "#3D6BAA",
          dark: "#1D3557",
          tint: "#E8EEF6",
        },
        brass: {
          DEFAULT: "#B4863A",
          tint: "#F5EDDE",
        },
        forest: {
          DEFAULT: "#3F7D58",
          tint: "#E7F1EA",
        },
        rust: {
          DEFAULT: "#B3462C",
          tint: "#F7E9E4",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(23, 27, 33, 0.04)",
      },
    },
  },
  plugins: [],
};
