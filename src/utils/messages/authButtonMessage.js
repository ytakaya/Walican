const authButtonMessage = async (paymentId, user_names) => {
  const names = user_names.join(", ");
  return {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "md",
      "contents": [
        {
          "type": "text",
          "text": `${names}さん、認証してください`
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
            "label": "認証する",
            "uri": `https://e1db85f9.ngrok.io/dutch?payId=${paymentId}`
          }
        }
      ]
    }
  }
}

exports = module.exports = authButtonMessage;