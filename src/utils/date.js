exports.formatDate = (date) => {
  let format = 'YYYY-MM-DD HH:MM'
  format = format.replace(/YYYY/, date.getFullYear());
  format = format.replace(/MM/, date.getMonth() + 1);
  format = format.replace(/DD/, date.getDate());
  format = format.replace(/HH/, ('0' + String(date.getHours())).slice(-2));
  format = format.replace(/MM/, ('0' + String(date.getMinutes())).slice(-2));

  return format;
}