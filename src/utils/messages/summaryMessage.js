const summaryMessage = async (summary, user_info) => {
  const contents = [];
  Object.keys(summary).forEach(userA_id => {
    contents.push({
      "type": "text",
      "text": user_info[userA_id]
    });
    contents.push({"type": "separator"});

    Object.keys(summary[userA_id]).forEach(userB_id => {
      const amount = summary[userA_id][userB_id];
      contents.push({
        "type": "text",
        "text": `${user_info[userB_id]}: ${amount}`
      })
    })

    contents.push({"type": "text", "text": "\n"});
  })
  console.log(contents);
  return "Hello summary!!"
}

exports = module.exports = summaryMessage;

const test = { U58400135e7e3993391c8c33a243bc102:
  { U58400135e7e3993391c8c33a243bc102: 0,
    adam_id: 1500,
    bob_id: 1000 },
 adam_id:
  { U58400135e7e3993391c8c33a243bc102: -1500,
    adam_id: 0,
    bob_id: -2000 },
 bob_id:
  { U58400135e7e3993391c8c33a243bc102: -1000,
    adam_id: 2000,
    bob_id: 0 } }