const request = require('request');
const URL = 'https://api.exchangeratesapi.io/latest';

exports.currencyConvert = async (amount, unit) => {
  const query = {
    uri: URL,
    headers: {'Content-type': 'application/json'},
    qs: {
        base: unit
    },
    json: true
  };

  request.get(query, (err, req, res) => {
    const rates = res.rates;
    return rates.JPY * amount
  });
}