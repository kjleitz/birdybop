/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  entry: path.resolve(__dirname, "src", "index.ts"),
  externals: [
    nodeExternals(),
  ],
  externalsPresets: {
    node: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: [
          /node_modules/,
        ],
        options: {
          transpileOnly: true, // ForkTsCheckerWebpackPlugin will do the type checking
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "tsconfig.json"),
      }),
    ],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
  ],
};
