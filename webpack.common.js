const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require("assets-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "src", "index.js")
  },

  output: {
    path: path.join(__dirname, process.env.OUT_DIR || "dist"),
    publicPath: "/",
    filename: "[name].js",
    assetModuleFilename: "[hash][ext]"
  },

  module: {
    rules: [
      {
        test: /\.(png|eot|woff2?|ttf|svg|gif)$/,
        type: "asset/resource"
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {cacheDirectory: true}
        }
      },

      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    new AssetsPlugin({
      filename: "webpack.json",
      path: path.join(__dirname, "site/data"),
      prettyPrint: true,
      keepInMemory: false
    })
  ]
};
