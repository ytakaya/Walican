exports.connectUser = function(client, ev) {
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: "使ってくれてありがとうピエ\n使い方\n/attend: ユーザーを登録\n/payment: 割り勘登録\n/auth: 割り勘を認証"
  })
}