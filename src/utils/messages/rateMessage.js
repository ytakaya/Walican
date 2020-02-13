const { visible_rate } = require('../../../config/country.config');

const rateMessage = async (rates) => {
  const contents = [];

  contents.push({
    "type": "text",
    "contents": [
      {
        "type": "span",
        "text": "rate message",
        "weight": "bold"
      }
    ]
  });

  contents.push({"type": "separator"});

  Object.keys(visible_rate).forEach(country => {
    contents.push({
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "text",
            "contents": [
              {
                "type": "span",
                "text": `${visible_rate[country].name}`
              }
            ]
          },
          {
            "type": "text",
            "contents": [
              {
                "type": "span",
                "text": rates[country],
              }
            ]
          }
        ]
      }
    )
  })
  
  return {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "md",
      "contents": contents
    }
  }
}

exports = module.exports = rateMessage;