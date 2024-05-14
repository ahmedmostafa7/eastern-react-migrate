const rewireCssModules = require("react-app-rewire-css-modules");

module.exports = function override(config, env) {
  // config.rules = [rewireCssModules];
  config.resolve.fallback = {
    fs: false,
    tls: false,
    net: false,
    path: false,
    zlib: false,
    http: false,
    https: false,
    stream: false,
    crypto: false,
    "crypto-browserify": require.resolve("crypto-browserify"),
    util: false,
  };
  return config;
};
