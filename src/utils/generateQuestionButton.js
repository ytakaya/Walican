const uuid = require('uuid/v1');

const generateQuestionButton = async () => {
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
            "text": "選択してピエ"
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
              "uri": `https://e1db85f9.ngrok.io/dutch?payId=${paymentId}`
            }
          },
          {
            "type": "button",
            "style": "primary",
            "action": {
              "type": "uri",
              "label": "貸した",
              "uri": `https://e1db85f9.ngrok.io/borrow?payId=${paymentId}`
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
              "uri": `https://e1db85f9.ngrok.io/auth_status?payId=${paymentId}`
            }
          },
          {
            "type": "button",
            "style": "secondary",
            "action": {
              "type": "uri",
              "label": "キャンセル",
              "uri": `https://e1db85f9.ngrok.io/cancel?payId=${paymentId}`
            }
          }
        ]
      }
    }
  }
}

exports = module.exports = generateQuestionButton;