const path =  require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config();
const envDefinePlugin = new webpack.DefinePlugin({
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.API_URL_LOCAL': JSON.stringify(process.env.API_URL_LOCAL),
});

module.exports = {
    devtool: 'inline-source-map',
    entry: path.join(__dirname, '/src/index'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: path.join(__dirname, 'src'),
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.s*css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']

            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: 'url-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        host: '127.0.0.1',
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        envDefinePlugin,
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    node: {
        fs: 'empty',
        net: 'empty',
        dns: 'empty'
    }
};
