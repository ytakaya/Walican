const db_logics = require('../utils/dbs/logics.js');

exports.connectUser = async (evsource, user_profile, client, ev) => {
  const status = await db_logics.registGroupAndUser(evsource, user_profile);

  let text;
  if (status == 'alreadyRegisted') {
    text = `😎「${user_profile.displayName}」は登録済みです😎`
  } else if (status) {
    text = `💥「${user_profile.displayName}」を登録しました💥`
  } else {
    text = `😢「${user_profile.displayName}」を登録に失敗したよ...😢`
  }

  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: text
  })
}