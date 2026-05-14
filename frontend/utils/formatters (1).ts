// frontend/utils/formatters.ts

// FORMAT DATE
export function formatDate(
  date: string | Date
) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// FORMAT TIME
export function formatTime(
  date: string | Date
) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

// FORMAT DATE + TIME
export function formatDateTime(
  date: string | Date
) {
  return `${formatDate(date)} • ${formatTime(
    date
  )}`;
}

// FORMAT CURRENCY
export function formatCurrency(
  amount: number
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// FORMAT LARGE NUMBERS
export function formatCompactNumber(
  value: number
) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

// FORMAT BIOMARKER VALUE
export function formatBiomarkerValue(
  value: number,
  unit?: string
) {
  return `${value}${
    unit ? ` ${unit}` : ""
  }`;
}

// FORMAT HEALTH SCORE
export function formatHealthScore(
  score: number
) {
  return `${score}/100`;
}

// FORMAT REPORT STATUS
export function formatStatus(
  status: string
) {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

// FORMAT PERCENT CHANGE
export function formatChange(
  value: number
) {
  if (value > 0) {
    return `↑ ${value}%`;
  }

  if (value < 0) {
    return `↓ ${Math.abs(value)}%`;
  }

  return "0%";
}

// FORMAT FILE SIZE
export function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

// FORMAT AI CONFIDENCE
export function formatConfidence(
  value: number
) {
  return `${Math.round(value)}% confidence`;
}

// FORMAT RELATIVE TIME
export function formatRelativeTime(
  date: string | Date
) {
  const now = new Date().getTime();

  const target = new Date(date).getTime();

  const diff = now - target;

  const minutes = Math.floor(
    diff / (1000 * 60)
  );

  const hours = Math.floor(
    diff / (1000 * 60 * 60)
  );

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${days}d ago`;
}