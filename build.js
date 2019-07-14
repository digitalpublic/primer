var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdownit'),
    layouts  = require('metalsmith-layouts'),
    assets = require('metalsmith-assets'),
    discoverPartials = require('metalsmith-discover-partials');

    Metalsmith(__dirname)
    .source('./src/content')            // source directory
    .use(markdown({
        typographer: true,
        html: false
      }))
      .use(discoverPartials({
        "directory": "layouts/partials",
      }))
    .use(layouts())
  
    .destination('./dist')
    .use(assets({
      source: './src/img', // relative to the working directory
      destination: './img' // relative to the build directory
    }))
    .use(assets({
      source: './src/scripts/compiled', // relative to the working directory
      destination: './scripts' // relative to the build directory
    }))
    .use(assets({
      source: './src/static', // relative to the working directory
      destination: './' // relative to the build directory
    }))
    .build(function (err) { if(err) console.log(err) })