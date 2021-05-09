const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack'); //访问内置的插件
const path = require("path");

module.exports = {
    entry: {
        polyfills: './src/polyfills.js',
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: '/',
    },
    resolve: {
		extensions: ['*', '.js', '.jsx', '.ts'],
		alias: {
            compoents: path.join(__dirname, 'src/components'),
            reactDom: '@hot-loader/react-dom',
		}
    },
    module: {
        rules:[
            { test: /\.ts$/, exclude: /node_modules/, use: 'ts-loader' },
            { 
                test: /\.css$/, 
                exclude: /node_modules/, 
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            { 
                test: /\.(js|jsx)$/, 
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'babel-preset-env',
                            "es2015"
                        ]
                    },
                }
            },
        ]
    },
    plugins: [
        //每次清理 output 文件夹
        new CleanWebpackPlugin(),
        //创建html文件
        new HtmlWebpackPlugin({
            title: 'test HtmlWebpackPlugins Output Management',
            template:'./template/index.html',
        }),
    ]
};