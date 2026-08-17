export function formatDualPrice(amount, rate = 900) {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value) || !Number.isFinite(rate)) {
    return {
      cedi: '₵0',
      naira: '≈ ₦0',
    };
  }

  return {
    cedi: `₵${value.toLocaleString()}`,
    naira: `≈ ₦${Math.round(value * rate).toLocaleString()}`,
  };
}
