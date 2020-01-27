const db_logics = require('../utils/dbs/logics.js');

exports.summaryReply = async (ev) => {
  db_logics.getSummaryAndUsers(ev.source.groupId).then(res => {
    const {datas, users} = res;
    _payoff(datas, users).then(summary => {
      console.log(summary);
    })
  })
}

function _payoff(datas, users) {
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
        summary[data.parent][child] += data.amount;
        summary[child][data.parent] -= data.amount;
      }
      else if (data.method == 'dutch') {
        const amountPerUser = data.amount / data.children.length;
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