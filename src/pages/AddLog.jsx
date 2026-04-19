import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddLog() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState("car");
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    if (!type || !value) return;

    try {
      await addDoc(collection(db, "logs"), {
        userId: user.uid,
        type,
        value: Number(value),
        date: new Date(),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <div className="card form-card">

        <h2>Add Travel Activity</h2>
        <p className="subtext">
          Track how you travelled and how far.
        </p>

        {/* Transport buttons */}
        <div className="transport-buttons">
          <button
            className={type === "car" ? "active" : ""}
            onClick={() => setType("car")}
          >
            🚗 Car
          </button>

          <button
            className={type === "bus" ? "active" : ""}
            onClick={() => setType("bus")}
          >
            🚌 Bus
          </button>

          <button
            className={type === "bike" ? "active" : ""}
            onClick={() => setType("bike")}
          >
            🚲 Bike
          </button>
        </div>

        {/* Input */}
        <input
          className="input full-width"
          type="number"
          placeholder="Distance travelled (in km)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {/* Button */}
        <button className="button full-width" onClick={handleSubmit}>
          Save Activity
        </button>

      </div>
    </div>
  );
}