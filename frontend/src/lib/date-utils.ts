export function humanTimeAgo(date: Date): string {
  const thenSeconds = date.getTime() / 1000;
  const nowSeconds = new Date().getTime() / 1000;

  const seconds = nowSeconds - thenSeconds;
  const minutes = seconds / 60;
  if (minutes < 1) return "less than 1 minute ago";
  if (minutes < 2) return "1 minute ago";

  const hours = minutes / 60;
  if (hours < 1) return `${minutes.toFixed(0)} minutes ago`;
  if (hours < 2) return "1 hour ago";

  const days = hours / 24;
  if (days < 1) return `${hours.toFixed(0)} hours ago`;
  if (days < 2) return "1 day ago";

  const years = days / 365.2422;
  const months = years * 12;
  if (months < 1) return `${days.toFixed(0)} days ago`;
  if (months < 2) return "1 month ago";

  if (years < 1) return `${months.toFixed(0)} months ago`;
  if (years < 2) return `1 year ago`;

  return `${years.toFixed(0)} years ago`;
}
