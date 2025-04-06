// client/src/components/RevenueSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueSection = () => {
  const [revenues, setRevenues] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
  });
  const token = localStorage.getItem("token");
  const apiUrl = "https://hms-1-1af5.onrender.com/api/revenue";

  // Fetch revenue data from the backend
  const fetchRevenues = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRevenues(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching revenue data");
    }
  };

  // Load data on mount and set an interval for real-time updates
  useEffect(() => {
    let interval;
    if(revenues.length !== 0) {
        fetchRevenues();
        interval = setInterval(fetchRevenues, 5000);
    }  
    return () => clearInterval(interval);
  }, []);

  // Process revenue data for the chart
  const chartData = revenues.map((rev) => ({
    date: new Date(rev.date).toLocaleDateString(),
    amount: rev.amount,
  }));

  // Handle input changes in the form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to post new revenue data
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare new revenue object. Use current date if none is provided.
    const newRevenue = {
      amount: Number(formData.amount),
      date: formData.date || new Date().toISOString(),
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRevenue),
      });
      const data = await response.json();
      // Update the revenue list and clear the form
      setRevenues([...revenues, data]);
      setFormData({ amount: "", date: "" });
    } catch (err) {
      console.error(err);
      setError("Error posting revenue data");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        className="bg-white shadow rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Revenue Trends</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        
        {/* Revenue Form for adding new revenue */}
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Revenue
          </button>
        </form>
        
        {/* Revenue Line Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueSection;
