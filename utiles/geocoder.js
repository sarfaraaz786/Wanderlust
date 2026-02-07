const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
  httpAdapter: "https",
  formatter: null,
  headers: {
    "User-Agent": "student-fullstack-project/1.0 (student@gmail.com)"
  }
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
