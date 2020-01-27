const db_logics = require('../utils/dbs/logics');

exports.authUserByPayId = function(userId, payId) {
  return new Promise(resolve => {
    db_logics.getChildrenByPayId(payId).then(children => {
      let user_status = children[userId];
      if (user_status == null) resolve('invalidUser');
      else if (user_status) resolve('alreadyAuthed');
      else {
        children[user_id] = true;
        db_logics.updatePayments(payId, {children: children});
        resolve('updated');
      }
    })
  })
}