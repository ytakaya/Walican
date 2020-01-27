const db_logics = require('../utils/dbs/logics');

exports.authUserByPayId = function(userId, payId) {
  db_logics.getChildrenByPayId(payId).then(children => {
    let user_status = children.filter(user_id => {
      user_id == userId
    })
    if (!user_status) return 'alreadyAuthed';
    else {
      
    }
  })
}