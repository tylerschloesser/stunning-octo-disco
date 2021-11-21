import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = <webpack.Configuration>{
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: __dirname + '/docs',
    filename: 'bundle.js',
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true,
    }),
  ],
}
