const db_logics = require('../dbs/logics');
const { visible_rate } = require('../../../config/country.config');

const authMessage = (data, propose, paymentId, user_names, parent, method) => {
  return new Promise(resolve => {
    const propose_message = (propose=='') ? 'なし' : propose;
    db_logics.getUsersByUserIds([parent]).then(parent => {
      const auth_info_message = createAuthInfo(data, propose_message, user_names, parent[0].name, method);
      resolve({authInfo: auth_info_message, authMessage: `/auth ${paymentId}`})
    })
  })
}

function createAuthInfo (data, propose, users, parent, method) {
  const auth_emojis = ['😎😎', '😏😏', '🐱🐱', '😈😈', '🤗🤗', '😛😛', '😉😉'];
  const auth_emoji = auth_emojis[Math.floor(Math.random() * auth_emojis.length)]

  const prop_emojis = ['🐶', '🐈', '🐰' , '🐭', '🦊', '🐼', '🐨'];
  const prop_emoji = prop_emojis[Math.floor(Math.random() * prop_emojis.length)]

  const method_message = (method=='dutch') ? '割り勘' : '貸し';

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
        "text": `から`
      },
      {
        "type": "span",
        "text": `${method_message}`,
        "color": '#ff0088',
      },
      {
        "type": "span",
        "text": `の認証申請が届いています${auth_emoji}`
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
          "wrap": true,
          "contents": [
            {
              "type": "span",
              "text": `${String(data.jpy)}円 (${String(data.original)}${visible_rate[data.currency].unit})`,
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
              "text": `目的${prop_emoji}:`
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