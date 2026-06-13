export const EXPIRY_WARNING_DAYS = 30;

export function getDaysRemaining(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(expiryDate: string): "normal" | "warning" | "expired" {
  const days = getDaysRemaining(expiryDate);
  if (days < 0) return "expired";
  if (days <= EXPIRY_WARNING_DAYS) return "warning";
  return "normal";
}

export function getExpiryStatusText(status: "normal" | "warning" | "expired", daysRemaining?: number): string {
  if (status === "expired") return `已过期 ${Math.abs(daysRemaining ?? 0)} 天`;
  if (status === "warning") return `临期（剩余 ${daysRemaining} 天）`;
  return `剩余 ${daysRemaining} 天`;
}
