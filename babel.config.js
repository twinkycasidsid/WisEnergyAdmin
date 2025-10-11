// babel.config.js
export default {
    presets: [
        '@babel/preset-env',  // Ensure ES6+ code is transformed to ES5
        '@babel/preset-react' // Ensure JSX is transformed to JavaScript
    ],
    plugins: ['@babel/plugin-transform-runtime'],
};
