const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  entry: {
    assets: './src/scripts/exercises/assets.js',
    beneficiaries: './src/scripts/exercises/beneficiaries.js',
  //  management: "./src/exercises/management.js",
    purpose: "./src/scripts/exercises/purpose.js",
    risks: "./src/scripts/exercises/risks.js",
    assetsQuiz: "./src/scripts/quiz/sections/assets.js",
    beneficiariesQuiz: "./src/scripts/quiz/sections/beneficiaries.js",
    managementQuiz: "./src/scripts/quiz/sections/management.js",
    permissionsQuiz: "./src/scripts/quiz/sections/permissions.js",
    purposeQuiz: "./src/scripts/quiz/sections/purpose.js",
    risksQuiz: "./src/scripts/quiz/sections/risks.js",
    results: "./src/scripts/quiz/results.js"
  //  permissions: "./src/exercises/permissions.js"

  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src/scripts/compiled')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8888
  },
  resolve: {
      alias:{
    
      }
  },
  module:{
    rules:[
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            
     ]
  },
  module: {
    
},
  plugins: [
  //  new ExtractTextPlugin({filename:'app.bundle.css'}),
    new UglifyJsPlugin()

]
};