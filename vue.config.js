const webpack = require('webpack');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  filenameHashing: false,
  publicPath: './',
  productionSourceMap: false,//生产环境 不生成source map源文件 Production environment does not generate source map source files
  configureWebpack: config => {
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     'introJs': ['intro.js']
    //   })
    // ]
    config.plugins = [
      ...config.plugins, // this is important !
      new webpack.ProvidePlugin({
        'introJs': ['intro.js']
      })
    ]
    // 移除 prefetch 插件 remove prefetch plugin
    //config.plugins.delete('prefetch')
    // 移除 preload 插件 remove preload plugin
    //config.plugins.delete('preload');
    // if (process.env.NODE_ENV === "production") {
    //   // 为生产环境修改配置... Modify configuration for production environment...
    //   config.externals = { // 不会被打包的库 Libraries that won't be packaged
    //     // 'echarts': 'echarts',
    //     // 'echarts-gl': 'echarts-gl',
    //    // 'Plotly': 'plotly'
    //    // 'leaflet': 'leaflet',
    //    //'introJs': 'introJs'
    //    //'antd': 'antd'
    //   }
    // }
  },
  // chainWebpack: config => {  
  //   if (process.env.NODE_ENV === 'production') {
  //     // 生产环境下注入一个变量cdn 变量可以在html中通过htmlWebpackPlugin.options进行获取
         // Inject a variable cdn in the production environment. The variable can be obtained in html through htmlWebpackPlugin.options
  //     config.plugin('html')
  //          .tap(args => {
  //              args[0].cdn = 'prod';
  //              return args;
  //          })
  //     //config
  //     //     .plugin('webpack-bundle-analyzer')// 使用webpack-bundle-analyzer检查打包加载的各种依赖大小与速度 Use webpack-bundle-analyzer to check the size and speed of various dependencies loaded by the package
  //     //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)// 这样就可以分析哪些文件过大，而导致打包后chunk-vendors文件过大 In this way, you can analyze which files are too large, which leads to the large chunk-vendors file after packaging
       
  //   }
  //   //else{//开发环境 development environment
    
  //   //}
  // },
}