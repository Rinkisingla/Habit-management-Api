// Example utility for streak
function calculateStreaks(completions, goalType) {
  let currentStreak = 0, longestStreak = 0;
  let prev = null;

  completions.forEach(date => {
    if (!prev) {
      currentStreak = 1;
    } else {
      let diff = dayjs(date).diff(dayjs(prev), goalType === "daily" ? "day" : goalType === "weekly" ? "week" : "month");
      if (diff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    prev = date;
  });

  longestStreak = Math.max(longestStreak, currentStreak);
  return { currentStreak, longestStreak };
}
