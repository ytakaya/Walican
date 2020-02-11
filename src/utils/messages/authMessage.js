const authMessage = async (amount, propose, paymentId, user_names, parent) => {
  const names = user_names.join(", ");
  const propose_message = (propose=='') ? 'なし' : propose;
  return {authInfo: `${names}さん、${amount}円の認証依頼が来ました。以下のメッセージをコピーして送信してね\n目的「${propose_message}」`, authMessage: `/auth ${paymentId}`}
}

exports = module.exports = authMessage;