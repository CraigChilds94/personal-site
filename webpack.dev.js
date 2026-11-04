const path = require("path");
const {merge} = require("webpack-merge");

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",

  devServer: {
    port: process.env.PORT || 3000,
    static: {
      directory: path.join(__dirname, "dist"),
      watch: true
    },
    open: true,
    historyApiFallback: {
      rewrites: [{from: /./, to: "/404.html"}]
    }
  }
});
