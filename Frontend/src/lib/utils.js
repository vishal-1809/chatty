
export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour12: false,
    });
  }
  