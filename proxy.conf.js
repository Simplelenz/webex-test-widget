const PROXY_CONFIG = {
  "/cisco": {
      "target": "https://api.ciscospark.com",
      "secure": false,
      "pathRewrite": {"^/cisco" : ""},
      "changeOrigin": true,
      // "bypass": function (req, res, proxyOptions) {
      //     if (req.headers.accept.indexOf("html") !== -1) {
      //         console.log("Skipping proxy for browser request.");
      //         return "/index.html";
      //     }
      //   req.headers["tbx-web-user-id"] = "17447";
      //   req.headers["tbx-web-client-id"] = "10452";
      //   req.headers["tbx-web-user-name"] = "tony";
      // }
  },
  // "/app": {
  //   "target": "http://localhost:3001",
  //   "secure": false
  // }
}

module.exports = PROXY_CONFIG;
