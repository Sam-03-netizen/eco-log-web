import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const emissionFactors = {
      car: 0.21,
      bus: 0.1,
      bike: 0,
    };

    const q = query(
      collection(db, "logs"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => doc.data());

      const grouped = {};

      logs.forEach((log) => {
        const co2 = log.value * (emissionFactors[log.type] || 0);
        if (!grouped[log.type]) grouped[log.type] = 0;
        grouped[log.type] += co2;
      });

      const chartData = Object.keys(grouped).map((key) => ({
        type: key,
        co2: grouped[key],
      }));

      const cleanedData = chartData.filter(item => item.co2 > 0);
      setData(cleanedData);
    });

    return () => unsubscribe();
  }, [user]);

  const highest =
    data.length > 0
      ? data.reduce((max, curr) =>
          curr.co2 > max.co2 ? curr : max
        )
      : null;

  return (
    <div className="main-content">
      <div className="container">

        <div className="card">
        <h2>📊 Your Carbon Breakdown</h2>
        <p className="hint">
          See which activities contribute most to your emissions.
        </p>

        <p style={{ marginTop: "10px", opacity: 0.7 }}>
          🚲 Bike produces zero emissions, so it may not appear in the chart.
        </p>

        {highest && (
          <p className="highlight">
            Biggest contributor: <strong>{highest.type}</strong>
          </p>
        )}
      </div>

      <div className="card">

        {data.length === 0 ? (
          <p>No data yet</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="co2" fill="#26DE81" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  </div>
);
}