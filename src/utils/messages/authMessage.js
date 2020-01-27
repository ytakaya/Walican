const authMessage = async (amount, paymentId, user_names) => {
  const names = user_names.join(", ");
  return {authInfo: `${names}さん、${amount}円の認証依頼が来ました。以下のメッセージをコピーして送信してね`, authMessage: `/auth ${paymentId}`}
}

exports = module.exports = authMessage;