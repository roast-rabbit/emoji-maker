const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  entry: "./src/index.js",
  output: {
    filename: "bundle[fullhash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new MiniCssExtractPlugin({ filename: "main[fullhash].css" }),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src/assets"), to: path.resolve(__dirname, "dist/assets") },
        {
          from: path.resolve(__dirname, "src/positionData.json"),
          to: path.resolve(__dirname, "dist/positionData.json"),
        },
        {
          from: path.resolve(__dirname, "src/css/dict-web.css"),
          to: path.resolve(__dirname, "dist/dict-web.css"),
        },
        {
          from: path.resolve(__dirname, "src/index1.js"),
          to: path.resolve(__dirname, "dist/index1.js"),
        },
        {
          from: path.resolve(__dirname, "src/jquery-2.1.4.min.js"),
          to: path.resolve(__dirname, "dist/jquery-2.1.4.min.js"),
        },
        {
          from: path.resolve(__dirname, "src/translate-loading.svg"),
          to: path.resolve(__dirname, "dist/translate-loading.svg"),
        },
        {
          from: path.resolve(__dirname, "src/maker-1-data.json"),
          to: path.resolve(__dirname, "dist/maker-1-data.json"),
        },
        {
          from: path.resolve(__dirname, "src/maker-2-data.json"),
          to: path.resolve(__dirname, "dist/maker-2-data.json"),
        },
        {
          from: path.resolve(__dirname, "src/maker-3-data.json"),
          to: path.resolve(__dirname, "dist/maker-3-data.json"),
        },
        {
          from: path.resolve(__dirname, "src/icons.json"),
          to: path.resolve(__dirname, "dist/icons.json"),
        },
      ],
    }),
    // new WebpackObfuscator({
    //   rotateStringArray: true,
    // }),
  ],
  // mode: "production",
  // devtool: "inline-source-map",
  watch: true,
  devServer: {
    port: 8080,
    static: path.resolve(__dirname, "dist"),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      // {
      //   test: /\.js$/,
      //   enforce: "post",
      //   use: {
      //     loader: WebpackObfuscator.loader,
      //     options: {
      //       rotateStringArray: true,
      //     },
      //   },
      // },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  // if (argv.mode === "production") {
  //   config.plugins.push(
  //     new WebpackObfuscator({
  //       rotateStringArray: true,
  //     })
  //   );
  //   config.module.rules.push({
  //     test: /\.js$/,
  //     enforce: "post",
  //     use: {
  //       loader: WebpackObfuscator.loader,
  //       options: {
  //         rotateStringArray: true,
  //       },
  //     },
  //   });
  // }

  return config;
};
