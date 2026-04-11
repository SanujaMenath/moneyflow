export const getDatePresets = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Helper to format Date object to YYYY-MM-DD
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return {
    thisMonth: {
      start: formatDate(new Date(year, month, 1)),
      end: formatDate(new Date(year, month + 1, 0)), // 0 gets the last day of prev month
    },
    lastMonth: {
      start: formatDate(new Date(year, month - 1, 1)),
      end: formatDate(new Date(year, month, 0)),
    },
  };
};