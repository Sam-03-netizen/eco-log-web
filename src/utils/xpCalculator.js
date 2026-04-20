export function calculateXP(type, distance) {
  if (type === "bike") return distance * 5;   // best (eco friendly)
  if (type === "bus") return distance * 3;    // medium
  if (type === "car") return distance * 1;    // lowest

  return 0;
}