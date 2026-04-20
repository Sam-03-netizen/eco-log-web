import { useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc, // ✅ added
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { calculateXP } from "../utils/xpCalculator";

export default function AddLog() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState("car");
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    if (!value || value <= 0) {
      alert("Enter valid distance");
      return;
    }

    try {
      // 🔥 save log
      await addDoc(collection(db, "logs"), {
        userId: user.uid,
        type,
        value: Number(value),
        date: new Date(),
      });

      // 🔥 XP
      const xpEarned = calculateXP(type, Number(value));

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let newXP = xpEarned;
      let newStreak = 1;

      const today = new Date().toDateString();

      if (userSnap.exists()) {
        const data = userSnap.data();

        newXP += data.totalXP || 0;

        const lastDate = data.lastLogDate;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate === today) {
          newStreak = data.currentStreak;
        } else if (lastDate === yesterday.toDateString()) {
          newStreak = (data.currentStreak || 0) + 1;
        } else {
          newStreak = 1;
        }

        await updateDoc(userRef, {
          totalXP: newXP,
          currentStreak: newStreak,
          lastLogDate: today,
        });

      } else {
        // ✅ FIX: create user doc if not exists
        await setDoc(userRef, {
          totalXP: xpEarned,
          currentStreak: 1,
          lastLogDate: today,
        });
      }

      // ✅ UX FIX
      alert(`Saved ✅ +${xpEarned} XP`);
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Error saving activity ❌"); // ✅ feedback
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="card">
        <h2>Add Travel Activity</h2>
        <p style={{ opacity: 0.7 }}>
          Track how you travelled and how far.
        </p>

        <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
          {["car", "bus", "bike"].map((t) => (
            <button
              key={t}
              className="button"
              style={{
                background: type === t ? "#26DE81" : "#E2E8F0",
                color: type === t ? "#fff" : "#333",
              }}
              onClick={() => setType(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          className="input"
          type="number"
          placeholder="Distance travelled (in km)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          className="button"
          style={{ marginTop: "20px" }}
          onClick={handleSubmit}
        >
          Save Activity
        </button>
      </div>
    </div>
  </div>
);
}