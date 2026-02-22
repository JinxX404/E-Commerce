tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        "primary-hover": "#4338ca",
        "background-light": "#f9fafb",
        "background-dark": "#111827",
        "surface-light": "#ffffff",
        "surface-dark": "#1f2937",
        "border-light": "#E5E7EB",
        "border-dark": "#374151",
        "card-light": "#FFFFFF",
        "card-dark": "#1F2937",
        "text-light": "#1F2937",
        "text-dark": "#F3F4F6",
        "text-muted-light": "#6B7280",
        "text-muted-dark": "#9CA3AF",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "1rem",
      },
    },
  },
};
