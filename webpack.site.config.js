const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

const modulePlugin = new ExtractTextPlugin({
  filename: '[name].[chunkhash].css',
  allChunks: true,
})

module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, './site-dist'),
    publicPath: '/ant-design/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].async.js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: modulePlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
            },
            { loader: 'less-loader',
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        use: modulePlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vender',
      minChunks: function (module) {
        return /node_modules/.test(module.context)
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: './site/index.html',
      inject: true,
      production: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    modulePlugin,
    new WebpackChunkHash({ algorithm: 'md5' }),
  ],
})
