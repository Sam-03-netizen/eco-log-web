import { useEffect, useState, useMemo } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  const [userData, setUserData] = useState({
    totalXP: 0,
    currentStreak: 0,
  });

  const emissionFactors = {
    car: 0.21,
    bus: 0.1,
    bike: 0,
  };

  // 🔥 logs
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

  // 🔥 user data
  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUserData(snap.data());
    };

    fetchUser();
  }, [user]);

  // 🌍 CO2
  const totalCO2 = useMemo(() => {
    return logs.reduce((sum, log) => {
      return sum + log.value * (emissionFactors[log.type] || 0);
    }, 0);
  }, [logs, emissionFactors]);

  // 🌱 LEVEL
  const getLevel = (xp) => {
    if (xp < 500) return "🌱 Seedling";
    if (xp < 1500) return "🌿 Sapling";
    if (xp < 3000) return "🌳 Tree";
    return "🌍 Rainforest";
  };

  // 🗑️ delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "logs", id));
  };

  // ✏️ edit
  const handleEdit = async (log) => {
    const newType = prompt("Type:", log.type);
    const newValue = prompt("Distance:", log.value);

    if (!newType || !newValue) return;

    await updateDoc(doc(db, "logs", log.id), {
      type: newType,
      value: Number(newValue),
    });
  };

  return (
    <div className="main-content">
      <div className="container">

        {/* HEADER */}
        <p style={{ opacity: 0.7, marginBottom: "20px" }}>
          Track your travel and improve your environmental impact 🌍
        </p>

        <p style={{
          fontWeight: "500",
          marginBottom: "15px"
        }}>
          Your travel choices directly impact your carbon footprint 🌍
        </p>

        {/* STATS GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "20px"
      }}>

        <div className="card">
          <div className="summary-title">🌱 Carbon</div>
          <div className="summary-value">
            {totalCO2.toFixed(2)} kg
          </div>
          <p style={{ fontSize: "13px", opacity: 0.6 }}>
            Lower is better 👍
          </p>
        </div>

        <div className="card">
          <div className="summary-title">🔥 Streak</div>
          <div className="summary-value">
            {userData.currentStreak === 0
              ? "Start 🚀"
              : `${userData.currentStreak} days`}
          </div>
          <p style={{ fontSize: "13px", opacity: 0.6 }}>
            Daily consistency matters
          </p>
        </div>

        <div className="card">
          <div className="summary-title">⚡ Eco Score</div>
          <div className="summary-value">
            {userData.totalXP}
          </div>
          <p style={{ fontSize: "13px", opacity: 0.6 }}>
            Earn points for eco-friendly travel
          </p>
        </div>

        <div className="card">
          <div className="summary-title">🌿 Eco Level</div>
          <div className="summary-value">
            {getLevel(userData.totalXP)}
          </div>
          <p style={{ fontSize: "13px", opacity: 0.6 }}>
            Your sustainability level
          </p>
        </div>

      </div>

      {/* LOGS */}
      <div className="card">
        <h3 style={{ marginBottom: "15px" }}>Your Activities</h3>

        {logs.length === 0 ? (
          <p style={{ opacity: 0.6 }}>
            No activities yet. Start tracking 🚀
          </p>
        ) : (
          logs.map((log) => {
            const co2 =
              log.value * (emissionFactors[log.type] || 0);

            return (
              <div
                key={log.id}
                className="log-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <strong>
                    {log.type} • {log.value} km
                  </strong>
                  <div style={{ opacity: 0.6, fontSize: "13px" }}>
                    {co2.toFixed(2)} kg CO₂
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="button"
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
    </div>
  );
}
