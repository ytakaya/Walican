const { visible_rate } = require('../../../config/country.config');

const rateMessage = async (rates) => {
  const contents = [];

  contents.push({
    "type": "text",
    "contents": [
      {
        "type": "span",
        "text": "🔁為替情報です🔁",
        "weight": "bold"
      }
    ]
  });

  contents.push({"type": "separator"});

  Object.keys(visible_rate).forEach(country => {
    contents.push({
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "contents": [
              {
                "type": "span",
                "text": `${visible_rate[country].flag} ${visible_rate[country].name} ${visible_rate[country].flag}`
              }
            ]
          },
          {
            "type": "text",
            "contents": [
              {
                "type": "span",
                "text": `\t100円 👉 ${String(Math.round(rates[country] * 100 * 100) / 100)}${visible_rate[country].unit}`,
              }
            ]
          },
          {
            "type": "text",
            "contents": [
              {
                "type": "span",
                "text": `\t1${visible_rate[country].unit} 👉 ${String(Math.round((1 / rates[country]) * 100) / 100)}円`,
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