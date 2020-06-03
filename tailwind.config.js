module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#66cccc",
        primaryDarker: "#3eb9b9",
        primaryDarkest: "#2f8d8d",
        primaryLighter: "#a1e0e0",
        primaryLightest: "#dcf3f3",
        secondary: "#cccc66",
        secondaryDarker: "#b9b93e",
        secondaryDarkest: "#8d8d2f",
        secondaryLighter: "#e5e5b0",
        secondaryLightest: "#f4f4dc",
        tertiary: "#6666cc",
        tertiaryDarker: "#4949c2",
        tertiaryDarkest: "#3939ab",
        grey: "#a3a3aa",
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
      }
    },
  },
  purge: {
    content: [
      "./site/layouts/**/*.html",
    ],
  },
  variants: {},
  plugins: [],
};
