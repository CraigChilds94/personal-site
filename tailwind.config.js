module.exports = {
    theme: {
        extend: {
            colors: {
                primary: "#4db42c",
                primaryDarker: "#c45d0b",
                primaryDarkest: "#7a3a07",
                primaryLighter: "#5dcf39",
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
                    "700": "#b5a89f",
                    "800": "#a39488",
                    "900": "#20241f",
                },
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
    purge: {
        content: ["./site/layouts/**/*.html"],
    },
    variants: {},
    plugins: [],
};
