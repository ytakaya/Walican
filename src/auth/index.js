const db_logics = require('../utils/dbs/logics');

exports.authUserByPayId = function(userId, payId) {
  return new Promise(resolve => {
    db_logics.getPaymentByPayId(payId).then(payment => {
      let user_status = payment.children[userId];
      if (user_status == null) resolve('invalidUser');
      else if (user_status) resolve('alreadyAuthed');
      else {
        payment.children[userId] = true;
        if (Object.values(payment.children).indexOf(false) == -1) {
          //認証完了の処理
          db_logics.insertSummary(
            payment.payment_id, 
            payment.group_id, 
            payment.parent, 
            payment.amount, 
            payment.method,
            Object.keys(payment.children))
          db_logics.updatePayments(payId, {children: payment.children, status: 'done'});
          resolve('authComplete');
        } else {
          db_logics.updatePayments(payId, {children: payment.children});
          resolve('updated'); 
        }
      }
    })
  })
}