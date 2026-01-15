// postcss.config.js
module.exports = {
    plugins: {
        "@tailwindcss/postcss": {}, // ← ここが変わった！
        autoprefixer: {},
    },
}