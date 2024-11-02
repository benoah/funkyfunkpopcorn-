// webpack.config.js

module.exports = {
  // ...andre innstillinger
  module: {
    rules: [
      // ...andre regler
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/@mediapipe\/tasks-vision/,
      },
    ],
  },
};
