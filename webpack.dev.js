const webpack = require("webpack");
const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require('dotenv');

const fs = require('fs'); // to check if the file exists

const currentPath = path.join(__dirname);

const envPath = currentPath + '/development.env';

// const finalPath = fs.existsSync(envPath)

const fileEnv = dotenv.config({ path: envPath }).parsed;

const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
  return prev;
}, {});

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/'
  },  
  module: {
    rules: [
    {
      test: /\.(css|sass|scss)$/,
      use: [
        "style-loader", //3. Inject styles into DOM
        "css-loader", //2. Turns css into commonjs
        "sass-loader" //1. Turns sass into css
      ]
    }
  ]
},
node: {
  fs: "empty"
},
devServer: {
  //Where do we want to serve our files from? The 'dist' folder
  contentBase: "/",
  //GZIP It!!
  compress: true,
  //Console logging setting
  stats: "errors-only",
  //Open a new window when running a new instance
  open: false,
  //Set the port
  port: 8080,
  //historyApiFallback true - enables router to resolve on refresh
  historyApiFallback: true,
  hot: true,
  // host : '10.0.31.235'
},
plugins: [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
    title: 'Face Recognition',
    hash: true,
  }),
  new webpack.DefinePlugin(envKeys)
]
});
