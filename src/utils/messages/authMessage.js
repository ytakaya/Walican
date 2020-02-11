const db_logics = require('../dbs/logics');

const authMessage = (amount, propose, paymentId, user_names, parent) => {
  return new Promise(resolve => {
    const propose_message = (propose=='') ? 'なし' : propose;
    db_logics.getUsersByUserIds([parent]).then(parent => {
      const auth_info_message = createAuthInfo(amount, propose_message, user_names, parent[0].name);
      resolve({authInfo: auth_info_message, authMessage: `/auth ${paymentId}`})
    })
  })
}

function createAuthInfo (amount, propose, users, parent) {
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

exports = module.exports = authMessage;