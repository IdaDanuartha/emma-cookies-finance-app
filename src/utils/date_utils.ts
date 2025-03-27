// Get the current date and time in GMT+8
export const getDateInGMT8 = (): Date => {
    const now = new Date(); // Get current UTC time
    const gmt8Offset = 8 * 60; // 8 hours in minutes
    const gmt8Date = new Date(now.getTime() + gmt8Offset * 60 * 1000);
    return gmt8Date;
  };
  
  // Get the start of the day in GMT+8
  export const getStartOfDayGMT8 = (): Date => {
    const gmt8Date = getDateInGMT8();
    return new Date(gmt8Date.getFullYear(), gmt8Date.getMonth(), gmt8Date.getDate());
  };
  
  // Get the start of the week (Monday) in GMT+8
  export const getStartOfWeekGMT8 = (): Date => {
    const gmt8Date = getDateInGMT8();
    const dayOfWeek = gmt8Date.getDay(); // 0 = Sunday
    const diffToMonday = gmt8Date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(gmt8Date.getFullYear(), gmt8Date.getMonth(), diffToMonday);
  };
  
  // Get the start of the month in GMT+8
  export const getStartOfMonthGMT8 = (): Date => {
    const gmt8Date = getDateInGMT8();
    return new Date(gmt8Date.getFullYear(), gmt8Date.getMonth(), 1);
  };
  
  // Get the start of the year in GMT+8
  export const getStartOfYearGMT8 = (): Date => {
    const gmt8Date = getDateInGMT8();
    return new Date(gmt8Date.getFullYear(), 0, 1);
  };  