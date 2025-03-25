// Format number to IDR currency, e.g. Rp100.000
export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  
// Format date to Indonesian readable format
export function formatDate(date: string | Date, showTime: boolean = true): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  if (showTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Date(date).toLocaleString("id-ID", options);
}

// Format date to input element
export function formatDateInput(dateStr: string): string {
  const date = new Date(dateStr);

  // Convert to GMT+8 by adding 8 hours (8 * 60 * 60 * 1000 ms)
  const offsetDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  const year = offsetDate.getUTCFullYear();
  const month = String(offsetDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(offsetDate.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
