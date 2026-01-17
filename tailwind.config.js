/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming/themes")["emerald"],
                },
                dark: {
                    ...require("daisyui/src/theming/themes")["dark"],
                    "neutral": "#e5e7eb",
                    "neutral-content": "#111827",
                    "base-content": "#5b6373",
                    "base-100": "#1f2937",
                    "base-200": "#111827",
                },
            },
        ],
    },
    plugins: [require("daisyui")],
}