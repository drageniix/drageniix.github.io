const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const outputPath = path.join(__dirname, "/public");
const appTitle = "Ashley Barrow";
const themeColor = "#4d004d";
const appDescription = "Full Stack Development";
const manifest = {
  name: appTitle,
  short_name: "Barrow",
  description: appDescription,
  background_color: "#ffffff",
  theme_color: themeColor,
  fingerprints: false,
  icons: [
    {
      src: path.resolve("./src/assets/icon.png"),
      sizes: [96, 128, 192, 256, 384, 512]
    }
  ]
};

function getPlugins(isProduction) {
  const plugins = [
    new HtmlWebPackPlugin({
      chunks: ["index"],
      template: path.resolve("./src/index.ejs"),
      filename: "index.html",
      title: appTitle,
      description: appDescription,
      themeColor: themeColor,
      favicon: path.resolve("./src/assets/favicon.png"),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        preserveLineBreaks: false
      }
    }),
    new WebpackPwaManifest(manifest),
    new MiniCssExtractPlugin({
      filename: "./styles/[hash].css",
      chunkFilename: "./styles/[name]-[hash].css"
    })
  ];

  if (isProduction) {
    plugins.unshift(
      new CleanWebpackPlugin({
        verbose: false
      }),
      new CopyWebpackPlugin([
        { from: path.resolve("./src/assets/static/_redirects") }
      ])
    );
  }

  return plugins;
}

module.exports = (env = "development") => {
  const isProduction = env == "production";

  return {
    entry: {
      index: [
        path.resolve("./src/app.tsx"),
        path.resolve("./src/styles/index.scss")
      ]
    },
    output: {
      path: outputPath,
      publicPath: "/",
      filename: "./scripts/[name].js"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.s?css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                url: false,
                sourceMap: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                plugins: () => [require("autoprefixer")()]
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    plugins: getPlugins(isProduction),
    optimization: {
      splitChunks: {
        chunks: "all"
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true
            }
          }
        })
      ]
    },
    resolve: {
      extensions: [".js", ".tsx", ".ts", ".json"]
    },
    devtool: isProduction ? "source-map" : "inline-source-map",
    mode: isProduction ? "production" : "development",
    stats: {
      colors: true,
      cachedAssets: false,
      chunks: false,
      modules: false,
      children: false,
      warnings: false
    },
    devServer: {
      hot: true,
      historyApiFallback: true,
      contentBase: outputPath
    }
  };
};
