const db_logics = require('../utils/dbs/logics.js');
const summaryMessage = require('../utils/messages/summaryMessage');

exports.summaryReply = async (client, ev) => {
  db_logics.getSummaryAndUsers(ev.source.groupId).then(res => {
    const {datas, users} = res;
    exports.payoff(datas, users).then(summary => {
      _getUserInfo(summary).then(user_info => {
        summaryMessage(summary, user_info).then(message => {
          return client.replyMessage(ev.replyToken, {
            type: "flex",
            altText: "Walicanからのメッセージ",
            contents: message,
          })
            .catch((err)=>console.log(err.originalError.response))
        })
      })
    })
  })
}

exports.payoff = (datas, users) => {
  return new Promise(resolve => {
    let summary = {};
    users.forEach(userA => {
      summary[userA] = {};
      users.forEach(userB => {
        summary[userA][userB] = 0
      })
    });

    datas.forEach(data => {
      if (data.method == 'borrow') {
        const child = data.children[0]
        summary[data.parent][child] += Math.ceil(data.amount / 10) * 10;
        summary[child][data.parent] -= Math.ceil(data.amount / 10) * 10;
      }
      else if (data.method == 'dutch') {
        const amountPerUser = Math.ceil((data.amount / data.children.length) / 10) * 10;
        data.children.forEach(child => {
          if (child != data.parent) {
            summary[data.parent][child] += amountPerUser;
            summary[child][data.parent] -= amountPerUser;
          }
        })
      }
    })
    resolve(summary);
  })
}

function _getUserInfo(summary) {
  return new Promise(resolve => {
    const user_ids = Object.keys(summary);
    db_logics.getUsersByUserIds(user_ids).then((users) => {
      let user_info = {}
      user_ids.forEach(user_id => {
        user_info[user_id] = users.filter(user => user.id == user_id)[0].name
      })
      resolve(user_info);
    })
  })
}