export const getDatePercentages = ({
  transactionsSince,
  scheduledUntil,
}: {
  transactionsSince: Date;
  scheduledUntil: Date;
}) => {
  const startDate = Math.max(transactionsSince.getTime(), Date.now());

  const today = new Date(startDate);
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const day = today.getDay();

  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInWeek = Math.min(daysInMonth, 7 - day);
  const dailyPercentage = 1 / (daysInMonth - date);
  const weeklyPercentage = dailyPercentage * daysInWeek;

  const dates = {
    today,
    day,
    date,
    month,
    year,
    daysInWeek,
    daysInMonth,
    dailyPercentage,
    weeklyPercentage,
    daysLeft: 0,
  };

  if (transactionsSince && scheduledUntil) {
    dates.daysLeft = Math.round(
      Math.abs(scheduledUntil.getTime() - startDate) / (1000 * 60 * 60 * 24)
    );
  }

  return dates;
};

export const countPaychecks = (dateFrom: Date, dateTo: Date) => {
  let paychecks = 0;
  let temp = new Date(dateFrom.toISOString());
  temp.setDate(temp.getDate() + 14);

  while (temp < dateTo) {
    temp.setDate(temp.getDate() + 14);
    paychecks++;
  }

  return paychecks || 1;
};

export const flatten = (arr: Array<any>) => {
  return Array.prototype.concat.apply([], arr);
};

export const frequencyMap: { [key: string]: number } = {
  weekly: 7,
  everyOtherWeek: 14,
  everyOtherMonth: 2,
  monthly: 1,
  yearly: 1,
  twiceAYear: 6,
};

export const addDates = (frequency: string, date: Date) => {
  switch (frequency) {
    case "yearly":
      date.setFullYear(date.getFullYear() + frequencyMap[frequency]);
      break;
    case "monthly":
    case "twiceAYear":
    case "everyOtherMonth":
      date.setMonth(date.getMonth() + frequencyMap[frequency]);
      break;
    case "weekly":
    case "everyOtherWeek":
    default:
      date.setDate(date.getDate() + frequencyMap[frequency]);
      break;
  }
};
