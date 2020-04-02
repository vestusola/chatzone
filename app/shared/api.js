/*at top file*/
var platform = require("platform");
var nativePlatformLocalhost;

/*in some function or globally*/
if (platform.device.os === platform.platformNames.ios) {
  /*localhost for ios*/
  nativePlatformLocalhost = "localhost";
} else if (platform.device.os === platform.platformNames.android) {
  /*localhost for android*/
  nativePlatformLocalhost = "10.0.2.2";
}

var api = {
  url: `http://${nativePlatformLocalhost}:5000/api/v1`
};

module.exports = api;