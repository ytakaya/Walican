exports.formatDate = () => {
  const date = new Date();
  let format = 'YYYY-MM-DD HH:MM'
  format = format.replace(/YYYY/, date.getFullYear());
  format = format.replace(/MM/, date.getMonth() + 1);
  format = format.replace(/DD/, date.getDate());
  format = format.replace(/HH/, date.getHours());
  format = format.replace(/MM/, date.getMinutes());

  return format;
}