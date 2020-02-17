const request = require('request');
const URL = 'https://api.exchangeratesapi.io/latest';

exports.currencyConvert = (amount, unit) => {
  return new Promise(resolve => {
    if (unit == 'JPY')
      resolve(amount)
    else {
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
        resolve(rates.JPY * amount)
      });
    }
  })
}