const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

exports.connectUser = async (evsource, user_profile, client, ev) => {
  const status = await registGroupAndUser(evsource, user_profile);

  let text;
  if (status == 'alreadyRegisted') {
    text = `「${user_profile.displayName}」は登録済みだよ！`
  } else if (status == 'success') {
    text = `「${user_profile.displayName}」を登録したよ！`
  } else {
    text = `「${user_profile.displayName}」を登録に失敗したよ...`
  }

  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: text
  })
}

function registGroupAndUser(evsource, user_profile) {
  return new Promise(resolve => {

  })
}