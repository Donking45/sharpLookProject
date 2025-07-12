const express = require('express');
const axios = require('axios');
const app = express();
const NodeGeocoder = require('node-geocoder')


const options = {
  provider: 'openstreetmap',
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;


/*/app.get('/geocode', async (req, res) => {
  const address = req.query.address || 'Lagos, Nigeria';
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'MyApp/1.0 (your@email)'
      }
    });

    res.json(response.data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coordinates' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
*/