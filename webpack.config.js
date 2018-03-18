const path = require('path');
const webpack = require('webpack');

const environment = process.env.NODE_ENV || 'development';

module.exports = {
    mode: environment,
    devtool: environment === 'development' ? 'source-map' : false,
    entry: {
        background: path.join(__dirname, 'src', 'background', 'index.js'),
        options: path.join(__dirname, 'src', 'options', 'App.jsx'),
        popup: path.join(__dirname, 'src', 'popup', 'App.jsx'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [
            path.join(__dirname, 'src'),
            path.resolve('node_modules'),
        ],
    },
    output: {
        path: path.join(__dirname, 'src', 'js'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                        ],
                        plugins: [
                            require('@babel/plugin-proposal-object-rest-spread'),
                            require('@babel/plugin-proposal-class-properties'),
                            require('babel-plugin-inferno'),
                        ],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'sass-loader',
                }],
            },
        ],
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Don't import the locales, at least not yet...
    ],
};