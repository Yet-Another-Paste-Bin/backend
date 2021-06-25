export const getExpiry =  (expiry = 86400000) => {
  let date = new Date();
  date.setTime(date.getTime() + expiry);
  return date;
};
