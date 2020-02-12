const request = require('request');
const { visible_rate } = require('../../config/country.config');
const URL = 'https://api.exchangeratesapi.io/latest';

exports.rateReply = async (client, ev) => {
  const query = {
    uri: URL,
    headers: {'Content-type': 'application/json'},
    qs: {
        base: 'JPY'
    },
    json: true
  };

  request.get(query, (err, req, res) => {
    const rates = res.rates;
    Object.keys(visible_rate).forEach(key => {
      console.log(key, rates[key]);
    })
  });
}