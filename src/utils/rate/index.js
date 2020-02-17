const request = require('request');
const URL = 'https://api.exchangeratesapi.io/latest';

exports.currencyConvert = (amount, unit) => {
  return new Promise(resolve => {
    const query = {
      uri: URL,
      headers: {'Content-type': 'application/json'},
      qs: {
          base: unit
      },
      json: true
    };
    console.log(amount,unit)
    request.get(query, (err, req, res) => {
      console.log(res)
      const rates = res.rates;
      resolve(rates.JPY * amount)
    });
  })
}