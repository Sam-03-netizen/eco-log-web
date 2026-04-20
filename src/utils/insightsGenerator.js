export function generateInsights(logs) {
  if (!logs || logs.length === 0) {
    return ["Start logging activities to get insights 🚀"];
  }

  const emissionFactors = {
    car: 0.21,
    bus: 0.1,
    bike: 0,
  };

  let totalCO2 = 0;
  let typeCO2 = {};

  logs.forEach((log) => {
    const co2 = log.value * (emissionFactors[log.type] || 0);
    totalCO2 += co2;

    if (!typeCO2[log.type]) typeCO2[log.type] = 0;
    typeCO2[log.type] += co2;
  });

  const insights = [];

  // 🔥 biggest contributor
  const biggest = Object.keys(typeCO2).reduce((a, b) =>
    typeCO2[a] > typeCO2[b] ? a : b
  );

  if (biggest === "car") {
    insights.push("⚠️ Most of your emissions come from car usage.");
    insights.push("💡 Try switching some trips to bus or bike.");
  }

  if (typeCO2["bike"]) {
    insights.push("🚀 Great job using bike — zero emissions!");
  }

  if (typeCO2["bus"]) {
    insights.push("👍 Bus travel is a good eco-friendly choice.");
  }

  if (totalCO2 < 2) {
    insights.push("🌱 Your carbon footprint is very low. Keep it up!");
  } else if (totalCO2 > 10) {
    insights.push("⚠️ Your emissions are high. Try reducing car usage.");
  }

  return insights;
}