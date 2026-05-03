const getSysDate = () => {
  return new Date();
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

module.exports = {
  getSysDate,
  formatDate,
  addDays
};
