require('dotenv').config()
const uuid = require('uuid/v1');
const HOST_URL = process.env.HOST_URL;

const questionButtonMessage = async () => {
  const paymentId = uuid();

  return {
    paymentId: paymentId,
    questionButton: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "text": "選択してね"
          },
          {
            "type": "separator"
          },
          {
            "type": "text",
            "text": `payId: ${paymentId}`
          },
          {
            "type": "button",
            "style": "primary",
            "action": {
              "type": "uri",
              "label": "割り勘",
              "uri": `${HOST_URL}/dutch?payId=${paymentId}`
            }
          },
          {
            "type": "button",
            "style": "primary",
            "action": {
              "type": "uri",
              "label": "貸した",
              "uri": `${HOST_URL}/borrow?payId=${paymentId}`
            }
          },
          {
            "type": "separator"
          },
          {
            "type": "button",
            "style": "secondary",
            "action": {
              "type": "uri",
              "label": "認証状況",
              "uri": `${HOST_URL}/auth_status?payId=${paymentId}`
            }
          },
          {
            "type": "button",
            "style": "secondary",
            "action": {
              "type": "uri",
              "label": "キャンセル",
              "uri": `${HOST_URL}/cancel?payId=${paymentId}`
            }
          }
        ]
      }
    }
  }
}

exports = module.exports = questionButtonMessage;