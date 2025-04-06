// client/src/components/InsuranceSection.jsx
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

const InsuranceSection = () => {
  const [claims, setClaims] = useState([]);
  const [formData, setFormData] = useState({
    claimNumber: "",
    policyHolder: "",
    status: "SUBMITTED",
  });
  const [editClaimId, setEditClaimId] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const apiUrl = "http://localhost:5000/api/insurance";

  // Fetch insurance claims from backend
  const fetchClaims = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setClaims(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching insurance claims");
    }
  };

  useEffect(() => {
    if(claims.length !== 0) fetchClaims();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for creating/updating a claim
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editClaimId) {
        // Update existing claim
        const response = await fetch(`${apiUrl}/${editClaimId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const updatedClaim = await response.json();
        setClaims(
          claims.map((claim) =>
            claim._id === editClaimId ? updatedClaim : claim
          )
        );
        setEditClaimId(null);
      } else {
        // Create new claim
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const newClaim = await response.json();
        setClaims([...claims, newClaim]);
      }
      // Reset the form
      setFormData({
        claimNumber: "",
        policyHolder: "",
        status: "SUBMITTED",
      });
    } catch (err) {
      console.error(err);
      setError("Error saving insurance claim");
    }
  };

  // Pre-fill form for editing a claim
  const handleEdit = (claim) => {
    setEditClaimId(claim._id);
    setFormData({
      claimNumber: claim.claimNumber,
      policyHolder: claim.policyHolder,
      status: claim.status,
    });
  };

  // Handle deletion of a claim
  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setClaims(claims.filter((claim) => claim._id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting insurance claim");
    }
  };

  // Calculate chart data: Group claims by creation date and count them
  const calculateChartData = (claims) => {
    const dataMap = {};
    claims.forEach((claim) => {
      // Use createdAt timestamp (provided by Mongoose timestamps)
      const dateKey = new Date(claim.createdAt).toLocaleDateString();
      dataMap[dateKey] = (dataMap[dateKey] || 0) + 1;
    });
    const dataArray = Object.keys(dataMap).map((date) => ({
      date,
      count: dataMap[date],
    }));
    // Sort the data by date
    dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    return dataArray;
  };

  const chartData = calculateChartData(claims);

  return (
    <div className="container mx-auto p-4">
      <motion.div
        className="bg-white shadow rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Insurance Claims
        </h2>
        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}
        {/* Insurance Claims Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <input
            type="text"
            name="claimNumber"
            value={formData.claimNumber}
            onChange={handleChange}
            placeholder="Claim Number"
            className="border p-2 rounded col-span-1"
            required
          />
          <input
            type="text"
            name="policyHolder"
            value={formData.policyHolder}
            onChange={handleChange}
            placeholder="Policy Holder"
            className="border p-2 rounded col-span-1"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded col-span-1"
          >
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 col-span-1"
          >
            {editClaimId ? "Update" : "Add"}
          </button>
        </form>
        {/* Claims Table */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Claim #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Policy Holder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {claim.claimNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {claim.policyHolder}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      claim.status === "APPROVED"
                        ? "text-green-500"
                        : claim.status === "PENDING"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  >
                    {claim.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-4">
                    <button
                      onClick={() => handleEdit(claim)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(claim._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No insurance claims found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Line Chart for Insurance Claims Data */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#82ca9d"
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

export default InsuranceSection;
