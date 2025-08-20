function calculateStreaks(completions, goalType) {
  if (!completions.length) return { currentStreak: 0, longestStreak: 0 };

  // Ensure ascending order
  completions = completions.sort((a, b) => new Date(a) - new Date(b));

  const unit = goalType === "daily" ? "day" : goalType === "weekly" ? "week" : "month";

  let currentStreak = 0, longestStreak = 0;
  let prev = null;

  completions.forEach(date => {
    if (!prev) {
      currentStreak = 1;
    } else {
      const diff = dayjs(date).diff(dayjs(prev), unit);
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
