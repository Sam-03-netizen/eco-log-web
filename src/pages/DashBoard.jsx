import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  const emissionFactors = {
    car: 0.21,
    bus: 0.1,
    bike: 0,
  };

  const transportIcons = {
    car: "🚗",
    bus: "🚌",
    bike: "🚲",
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "logs"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "logs", id));
  };

  const handleEdit = async (log) => {
    const newType = prompt("Transport type (car, bus, bike):", log.type);
    const newValue = prompt("Distance (km):", log.value);

    if (!newType || !newValue) return;

    await updateDoc(doc(db, "logs", log.id), {
      type: newType,
      value: Number(newValue),
    });
  };

  const totalCO2 = logs.reduce((sum, log) => {
    const factor = emissionFactors[log.type] || 0;
    return sum + log.value * factor;
  }, 0);

  return (
    <div className="container">

      {/* 🌱 App Meaning */}
      <p className="subtitle">
        Track your daily travel and understand your carbon footprint 🌍
      </p>

      {/* 🌿 Summary */}
      <div className="card">
        <h2 className="summary-title">🌱 Your Carbon Impact Today</h2>

        <div className="summary-value">
          {totalCO2.toFixed(2)} kg CO₂
        </div>

        <p className="hint">
          This is the total carbon emitted based on your travel today.
        </p>
      </div>

      {/* 📋 Logs */}
      <div className="card">
        <h3>Your Activities</h3>

        {logs.length === 0 ? (
          <p className="empty-text">
            No activities yet. Start by logging your travel 🚀
          </p>
        ) : (
          logs.map((log) => {
            const co2 =
              log.value * (emissionFactors[log.type] || 0);

            return (
              <div key={log.id} className="log-item">
                <span>
                  {transportIcons[log.type] || "❓"}{" "}
                  <strong>{log.type}</strong> • {log.value} km
                  <br />
                  <small>
                    {co2 === 0
                      ? "0 kg CO₂ (Great choice 🌱)"
                      : `${co2.toFixed(2)} kg CO₂`}
                  </small>
                </span>

                <div className="log-actions">
                  <button
                    className="button small"
                    onClick={() => handleEdit(log)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(log.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}