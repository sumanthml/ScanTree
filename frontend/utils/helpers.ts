// frontend/utils/helpers.ts

// FORMAT USER NAME
export function getInitials(
  name: string
): string {
  if (!name) return "";

  const words = name.trim().split(" ");

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}

// SHORTEN LARGE TEXT
export function truncateText(
  text: string,
  maxLength: number
): string {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(
    0,
    maxLength
  )}...`;
}

// GENERATE RANDOM ID
export function generateId(
  prefix = "id"
): string {
  return `${prefix}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;
}

// SLEEP / DELAY
export function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

// GET STATUS COLOR
export function getStatusColor(
  status: string
) {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
    case "normal":
      return "#22C55E";

    case "processing":
    case "analyzing":
    case "info":
      return "#2563EB";

    case "warning":
    case "pending":
      return "#F59E0B";

    case "critical":
    case "failed":
    case "danger":
      return "#EF4444";

    default:
      return "#64748B";
  }
}

// GET HEALTH LEVEL
export function getHealthLevel(
  score: number
) {
  if (score >= 85) {
    return {
      label: "Excellent",
      color: "#22C55E",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      color: "#3B82F6",
    };
  }

  if (score >= 50) {
    return {
      label: "Moderate",
      color: "#F59E0B",
    };
  }

  return {
    label: "Critical",
    color: "#EF4444",
  };
}

// FORMAT PERCENTAGE
export function formatPercentage(
  value: number
) {
  if (value > 0) {
    return `+${value}%`;
  }

  return `${value}%`;
}

// AI RISK LABEL
export function getRiskLevel(
  value: number
) {
  if (value >= 80) {
    return "Critical";
  }

  if (value >= 60) {
    return "High";
  }

  if (value >= 40) {
    return "Moderate";
  }

  return "Low";
}

// TIME GREETING
export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

// VALIDATE EMAIL
export function isValidEmail(
  email: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

// PASSWORD STRENGTH
export function getPasswordStrength(
  password: string
) {
  if (password.length < 6) {
    return {
      label: "Weak",
      color: "#EF4444",
    };
  }

  if (password.length < 10) {
    return {
      label: "Medium",
      color: "#F59E0B",
    };
  }

  return {
    label: "Strong",
    color: "#22C55E",
  };
}