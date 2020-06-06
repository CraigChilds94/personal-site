module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#ec823a",
        primaryDarker: "#c45d0b",
        primaryDarkest: "#7a3a07",
        primaryLighter: "#f1a470",
        primaryLightest: "#f8d1b7",
        secondary: "#f9c49a",
        secondaryDarker: "#f59950",
        secondaryDarkest: "#f27918",
        secondaryLighter: "#fbdabf",
        secondaryLightest: "#fefaf6",
        tertiary: "#7c3c21",
        tertiaryDarker: "#4e2615",
        tertiaryDarkest: "#2f170d",
        tertiaryLighter: "#ba5a31",
        tertiaryLightest: "#da9273",
        gray: {
          "100": "#f9f8f7",
          "200": "#f1eeec",
          "300": "#e8e4e1",
          "400": "#dfdad6",
          "500": "#d7d0cb",
          "600": "#cec6c0",
          "700": "#c6bcb5",
          "800": "#bdb2a9",
          "900": "#b5a89e",
        },
      },
      container: {
        center: true,
        padding: "2rem",
      },
      fontFamily: {
        serif: ['"Roboto Slab"', "sans-serif"],
        sans: ['"Open Sans"', "sans-serif"],
      },
      height: {
        104: "24rem",
      },
      zIndex: {
        "-10": "-10",
      },
    },
  },
  purge: {
    content: ["./site/layouts/**/*.html"],
  },
  variants: {},
  plugins: [],
};
