module.exports = {
    devServer: {
      proxy: {
        "/api": {
          target: "https://auth0-sample-code.vercel.app/"
        }
      }
    }
  };