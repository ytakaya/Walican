const summaryMessage = async (summary, user_info) => {
  const contents = [];
  Object.keys(summary).forEach(userA_id => {
    contents.push({
      "type": "text",
      "text": user_info[userA_id]
    });
    contents.push({"type": "separator"});

    Object.keys(summary[userA_id]).forEach(userB_id => {
      if (userB_id == userA_id) return;
      const amount = summary[userA_id][userB_id];
      contents.push({
        "type": "text",
        "text": `${user_info[userB_id]}: ${amount}`
      })
    })

    contents.push({"type": "text", "text": "\n"});
  })

  return {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "md",
      "contents": contents
    }
  }
}

exports = module.exports = summaryMessage;