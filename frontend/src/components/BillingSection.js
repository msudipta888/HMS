// client/src/components/BillingSection.jsx
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

const BillingSection = () => {
  // State to hold bills and form data
  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState({
    billNumber: "",
    amount: "",
    status: "PENDING",
    dueDate: "",
  });
  const [editBillId, setEditBillId] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const apiUrl = "http://localhost:5000/api/billing";

  // Fetch bills from backend
  const fetchBills = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBills(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching bills");
    }
  };

  // Load bills on component mount
  useEffect(() => {
    if(bills.length!==0){
      fetchBills();
    }
  }, []);

  // Calculate chart data: total amount per due date
  const calculateChartData = (bills) => {
    const dataMap = {};
    bills.forEach((bill) => {
      const dateKey = new Date(bill.dueDate).toLocaleDateString();
      dataMap[dateKey] = (dataMap[dateKey] || 0) + Number(bill.amount);
    });
    const dataArray = Object.keys(dataMap).map((date) => ({
      date,
      total: dataMap[date],
    }));
    dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    return dataArray;
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for creating/updating a bill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBillId) {
        // Update existing bill
        const response = await fetch(`${apiUrl}/${editBillId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const updatedBill = await response.json();
        setBills(bills.map((bill) => (bill._id === editBillId ? updatedBill : bill)));
        setEditBillId(null);
      } else {
        // Create new bill
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const newBill = await response.json();
        setBills([...bills, newBill]);
      }
      // Reset the form
      setFormData({ billNumber: "", amount: "", status: "PENDING", dueDate: "" });
    } catch (err) {
      console.error(err);
      setError("Error saving bill");
    }
  };

  // Handle bill deletion
  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(bills.filter((bill) => bill._id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting bill");
    }
  };

  // Pre-fill form for editing a bill
  const handleEdit = (bill) => {
    setEditBillId(bill._id);
    setFormData({
      billNumber: bill.billNumber,
      amount: bill.amount,
      status: bill.status,
      dueDate: bill.dueDate.slice(0, 10), // Format date for input
    });
  };

  // Prepare data for the line chart
  const chartData = calculateChartData(bills);

  return (
    <div className="container mx-auto p-4">
      <motion.div
        className="bg-white shadow rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Billing Dashboard</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {/* Billing Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
        >
          <input
            type="text"
            name="billNumber"
            value={formData.billNumber}
            onChange={handleChange}
            placeholder="Bill Number"
            className="border p-2 rounded col-span-1"
            required
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded col-span-1"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded col-span-1"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="border p-2 rounded col-span-1"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 col-span-1"
          >
            {editBillId ? "Update" : "Add"}
          </button>
        </form>
        {/* Bills Table */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bill #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{bill.billNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${bill.amount}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      bill.status === "OVERDUE" ? "text-red-500" : ""
                    }`}
                  >
                    {bill.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-4">
                    <button
                      onClick={() => handleEdit(bill)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bill._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Line Chart for Billing Data */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
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

export default BillingSection;
