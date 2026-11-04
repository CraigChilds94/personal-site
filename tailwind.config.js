/** @type {import("tailwindcss").Config} */
module.exports = {
    content: ["./site/layouts/**/*.html", "./site/content/**/*.md", "./site/data/**/*.yaml"],
    theme: {
        extend: {
            colors: {
                // Tailwind v1 palette values, kept so the site looks the same after the v3 upgrade
                gray: {
                    100: "#f7fafc",
                    200: "#edf2f7",
                    300: "#e2e8f0",
                    400: "#cbd5e0",
                    500: "#a0aec0",
                    600: "#718096",
                    700: "#4a5568",
                    800: "#2d3748",
                    900: "#1a202c",
                },
                green: {
                    500: "#48bb78",
                },
                // primary: "#4db42c",
                // primaryDarker: "#c45d0b",
                // primaryDarkest: "#7a3a07",
                // primaryLighter: "#5dcf39",
                // primaryLightest: "#f8d1b7",
                // secondary: "#f9c49a",
                // secondaryDarker: "#f59950",
                // secondaryDarkest: "#f27918",
                // secondaryLighter: "#fbdabf",
                // secondaryLightest: "#fefaf6",
                // tertiary: "#7c3c21",
                // tertiaryDarker: "#4e2615",
                // tertiaryDarkest: "#2f170d",
                // tertiaryLighter: "#ba5a31",
                // tertiaryLightest: "#da9273",
                // gray: {
                //     "100": "#f9f8f7",
                //     "200": "#f1eeec",
                //     "300": "#e8e4e1",
                //     "400": "#dfdad6",
                //     "500": "#d7d0cb",
                //     "600": "#cec6c0",
                //     "700": "#b5a89f",
                //     "800": "#a39488",
                //     "900": "#20241f",
                // },
            },
            container: {
                center: true,
                padding: "2rem",
            },
            fontFamily: {
                serif: ['"VT323"', "monospace"],
                sans: ['"VT323"', "monospace"],
                mono: ['"VT323"', "monospace"],
            },
            height: {
                104: "24rem",
            },
            zIndex: {
                "-10": "-10",
            },
        },
    },
    plugins: [],
};
