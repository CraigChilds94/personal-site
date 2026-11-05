/** @type {import("tailwindcss").Config} */
module.exports = {
    content: ["./site/layouts/**/*.html", "./site/content/**/*.md", "./site/data/**/*.yaml"],
    theme: {
        extend: {
            // Dark, near-black palette with one bright accent taken from the logo's green
            colors: {
                ink: {
                    DEFAULT: "#0c0c0d", // page background
                    surface: "#131315", // alternate sections
                    raised: "#19191c", // cards
                },
                fg: {
                    DEFAULT: "#e7e7ea", // headings and primary text
                    muted: "#a1a1aa", // body copy
                    subtle: "#6b6b74", // meta text and labels
                },
                line: "rgba(255, 255, 255, 0.08)",
                accent: {
                    DEFAULT: "#80db7e",
                    strong: "#9be799",
                },
            },
            container: {
                center: true,
                padding: "2rem",
            },
            fontFamily: {
                serif: ['"Mona Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
                sans: ['"Mona Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
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
