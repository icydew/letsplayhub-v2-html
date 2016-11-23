var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './app/index.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'games.html',
      template: './app/games.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'channels.html',
      template: './app/channels.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'game-all-video.html',
      template: './app/game-all-video.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'game-video.html',
      template: './app/game-video.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'game-all-channels.html',
      template: './app/game-all-channels.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'channel-all-video.html',
      template: './app/channel-all-video.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'channel-all-games.html',
      template: './app/channel-all-games.ejs'
    }),






    new HtmlWebpackPlugin({
      filename: 'templated.html',
      template: './app/templated.ejs',
      title: 'TEMPLATED PAGE'
    })
  ]

};