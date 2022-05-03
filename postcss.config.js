const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssNano = require("cssnano");
const postCssImport = require("postcss-import");
const postCssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [
    postCssImport,
    postCssPresetEnv,
    tailwindcss,
    autoprefixer,
    cssNano,
  ],
};
