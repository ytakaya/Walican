const authMessage = async (amount, propose, paymentId, user_names, parent) => {
  const names = user_names.join(", ");
  const propose_message = (propose=='') ? 'なし' : propose;
  return {authInfo: `${names}さん、${amount}円の認証依頼が来ました。以下のメッセージをコピーして送信してね\n目的「${propose_message}」`, authMessage: `/auth ${paymentId}`}
}

function createAuthInfo (amount, propose, user_names, parent) {
  const contents = [];
  users.forEach(user => {
    contents.push({
      "type": "text",
      "contents": [
        {
          "type": "span",
          "text": `🏄‍♂️　${user}さん`,
          "weight": "bold"
        }
      ]
    })
  });

  contents.push({"type": "separator"});

  contents.push({
    "type": "text",
    "contents": [
      {
        "type": "span",
        "text": `${parent}さん`,
        "weight": "bold"
      },
      {
        "type": "span",
        "text": `から認証申請が届いています😎😎`
      }
    ],
    "wrap": true,
  })

  contents.push({
    "type": "text",
    "text": `⬇️のメッセージをコピーして送信してください🙇‍♂️`,
    "wrap": true
  })

  contents.push({"type": "separator"});

  contents.push({
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "contents": [
            {
              "type": "span",
              "text": `金額💴:`
            }
          ]
        },
        {
          "type": "text",
          "contents": [
            {
              "type": "span",
              "text": `${String(amount)}円`,
              "color": '#0077ff'
            }
          ]
        }
      ]
    }
  )

  contents.push({
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "contents": [
            {
              "type": "span",
              "text": `目的🐶:`
            }
          ]
        },
        {
          "type": "text",
          "contents": [
            {
              "type": "span",
              "text": propose,
            }
          ]
        }
      ]
    }
  )
  
  const message = {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "md",
      "contents": contents
    }
  }
}

exports = module.exports = authMessage;