const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    options: './src/options/index.js', // 配置页
    popup: './src/popup/index.js', // 主弹窗
    background: './src/background/index.js', // 后台
    content: './src/content/index.js', // 注入页面的脚本
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/pages'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'options.html',
      chunks: ['options'],
      template: './src/options/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      chunks: ['popup'],
      template: './src/popup/index.html',
    }),
  ],
  mode: 'production',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
};
