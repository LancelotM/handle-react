const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack'); //访问内置的插件
const path = require("path");

module.exports = merge(common, {
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
    },
    devServer: {
        open: true,
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true,
        // allowedHosts: [
        //     '.host.com',
        //     'host2.com'
        // ],
        // before:function(app){
        //     app.get('/some/path', function(req, res) {
        //         res.json({ custom: 'response' });
        //     });
        // },
        // headers: {
        //     "X-Custom-Foo": "bar"
        // },
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     //webpack 插件列表。例如，当多个 bundle 共享一些相同的依赖，CommonsChunkPlugin 有助于提取这些依赖到共享的 bundle 中，来避免重复打包
        // }),
        // webpack-dev-server 强化插件
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
})