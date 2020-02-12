const request = require('request');
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
    console.log(res);
  });
}