const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    theme: {
        colors: {
            neutral: colors.slate,
            primary: colors.purple,
            text: colors.white,
        },
    },
    plugins: [],
};
