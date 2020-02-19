const summaryMessage = async (summary, user_info) => {
  const contents = [];
  contents.push({
    "type": "text",
    "text": '💸現在の貸し借り状況です💸'
  });
  contents.push({"type": "text", "text": "\n"});

  Object.keys(summary).forEach(userA_id => {
    contents.push({
      "type": "text",
      "contents": [
        {
          "type": "span",
          "text": user_info[userA_id],
          "weight": "bold"
        }
      ]
    });
    contents.push({"type": "separator"});

    Object.keys(summary[userA_id]).forEach(userB_id => {
      if (userB_id == userA_id) return;
      const amount = summary[userA_id][userB_id];
      const color = (amount < 0) ? '#ff0088' : '#0077ff';

      contents.push({
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "contents": [
                {
                  "type": "span",
                  "text": `${user_info[userB_id]}:`
                }
              ]
            },
            {
              "type": "text",
              "contents": [
                {
                  "type": "span",
                  "text": String(amount),
                  "color": color
                }
              ]
            }
          ]
        }
      )
    })

    contents.push({"type": "text", "text": "\n"});
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