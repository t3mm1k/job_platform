function getDayWord(count) {
  const lastTwo = count % 100;
  const lastOne = count % 10;
  if (lastTwo >= 11 && lastTwo <= 19) {
    return 'дней';
  }
  switch (lastOne) {
    case 1:
      return 'день';
    case 2:
    case 3:
    case 4:
      return 'дня';
    default:
      return 'дней';
  }
}
function calculateDays(floatUnixTime, targetDays = 31) {
  const currentDate = new Date();
  const pastDate = new Date(floatUnixTime * 1000);
  const diffMs = currentDate - pastDate;
  const daysPassed = diffMs / (1000 * 60 * 60 * 24);
  const daysRemaining = targetDays - daysPassed;
  const fullDaysPassed = daysPassed;
  const fullDaysRemaining = Math.max(0, daysRemaining);
  const roundedDaysPassed = Math.floor(daysPassed);
  const roundedDaysRemaining = Math.floor(daysRemaining);
  return {
    past: {
      days: roundedDaysPassed,
      daysWord: getDayWord(roundedDaysPassed),
      hours: Math.floor(daysPassed % 1 * 24),
      minutes: Math.floor(daysPassed % 1 * 24 % 1 * 60),
      full: fullDaysPassed.toFixed(2)
    },
    remaining: {
      days: Math.max(0, roundedDaysRemaining),
      daysWord: getDayWord(Math.max(0, roundedDaysRemaining)),
      hours: Math.max(0, Math.floor(daysRemaining % 1 * 24)),
      full: Math.max(0, daysRemaining).toFixed(2)
    }
  };
}
export { calculateDays, getDayWord };
