const authMessage = async (paymentId, user_names) => {
  const names = user_names.join(", ");
  return {authInfo: `${names}さん、以下のメッセージをコピーして送信してね`, authMessage: `/auth ${paymentId}`}
}

exports = module.exports = authMessage;