const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    theme: {
        colors: {
            neutral: colors.zinc,
            primary: colors.pink,
            text: colors.white,
        },
    },
    plugins: [],
};
