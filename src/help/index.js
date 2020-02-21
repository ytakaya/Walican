exports.HelpMessage = function(client, ev) {
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: "こんにちは🌞\n\
割り勘の計算をするためのWalican Botです！✌️\n\
⬇️使い方⬇️\n\
/connect: ユーザーを登録\n\
/pay: お金の貸し借りを登録\n\
/auth: 貸し借りを認証\n\
/summary: 現在の貸し借り状況を表示\n\
/rate: 為替レートの表示\n\
/help: ヘルプメッセージの表示"
  })
}