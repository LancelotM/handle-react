const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BabiliWebpackPlugin = require('babili-webpack-plugin');
const webpack = require('webpack'); //访问内置的插件

module.exports = merge(common, {
    entry: {
        vendor: [
            'lodash',
        ]
    },
    output: {
        filename: '[name].[chunkhash].js',
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        //处理公共的引入减少包体积
        new webpack.optimize.SplitChunksPlugin({
            name:['vendor','index']
        }),
        new UglifyJSPlugin({
            sourceMap: true,
        }),
        // new BabiliWebpackPlugin()
    ]
})