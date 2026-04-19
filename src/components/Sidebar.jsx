import { NavLink } from "react-router-dom";
import { FaLeaf, FaHome, FaPlusCircle, FaChartBar } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="logo">
        <FaLeaf className="logo-icon" />
        <div>
          <h2>EcoLog</h2>
          <p>Track your impact</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav-links">

        <NavLink to="/dashboard" className="nav-item">
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/add" className="nav-item">
          <FaPlusCircle className="nav-icon" />
          <span>Add Activity</span>
        </NavLink>

        <NavLink to="/analytics" className="nav-item">
          <FaChartBar className="nav-icon" />
          <span>Analytics</span>
        </NavLink>

      </nav>
    </div>
  );
}