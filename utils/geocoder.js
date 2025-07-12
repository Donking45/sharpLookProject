const express = require('express');
const axios = require('axios');
const app = express();
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  fetch: customFetch,
};

function customFetch(url, options) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'User-Agent': 'ShapeLook/1.0 (kingsleyokon610@gmail.com)' // Use your real contact info here
    }
  });
}

const geocoder = NodeGeocoder(options);
module.exports = geocoder;


