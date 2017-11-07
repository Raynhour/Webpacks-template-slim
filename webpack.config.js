// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const merge = require('webpack-merge');
// const pug = require('./webpack/pug');
// const devserver = require('./webpack/devserver');

// const PATHS = {
//   source: path.join(__dirname, 'src'),
//   dist: path.join(__dirname, 'dist')
// };

// const common = ([
//   {
//     entry: './src/js/index.js',
//     output: {
//       path: path.resolve(__dirname, 'dist'),
//       filename: 'bundle.js'
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//         title: 'Index page',
//         filename: 'index.html',
//         template: `${PATHS.source}/pages/index/index.pug`
//       })
//     ],
//     module: {
//       rules: [
//         { 
//             test: /\.js$/, 
//             exclude: /node_modules|bower_components/,
//             use: {
//                 loader: "babel-loader",
//                 options: {
//                     presets: ['es2015','stage-2'],
//                 },
//             },
//           },
//       ],
//     }
//   },
//   pug()
// ]);

// module.exports = function(env) {
//   if (env === 'production'){
//       return common;
//   }
//   if (env === 'development'){
//       return merge([
//           common,
//           devserver()
//       ])
//   }
// };


const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const pug = require('./webpack/pug');
const devserver = require('./webpack/devserver');
const babel = require('./webpack/babel');
const sass = require('./webpack/sass');
const extractCSS = require('./webpack/extract-text-plugin');
const css = require('./webpack/css');

const PATHS = {
    source: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist')
};

const common = merge([
    {
        entry: {
          libs:  "./src/js/libs.js", 
          index: './src/js/index.js'      
        },
        output: {
          path: PATHS.build,
          filename: 'js/[name].js'
        },
        plugins: [
          new HtmlWebpackPlugin({
              filename: 'index.html',
              chunks: ['index', 'common'],
              template: `${PATHS.source}/pages/index.pug`,
              inject: true
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
          }),
          new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
          })
        ]
    },
    pug()
]);

module.exports = function(env) {
    if (env === 'production'){
        return merge([
          common,
          babel(),
          extractCSS()
        ])
    }
    if (env === 'development'){
        return merge([
            common,
            devserver(),
            sass(),
            css(),
            extractCSS()
        ])
    }
};



