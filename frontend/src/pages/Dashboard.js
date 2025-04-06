// client/src/pages/Dashboard.jsx
import React from "react";

import BillingSection from "../components/BillingSection";
import InsuranceSection from "../components/InsuranceSection";
import RevenueSection from "../components/RevenueSection";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="container mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track your billing, insurance claims, and revenue trends at a glance.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BillingSection />
          <InsuranceSection />
        </div>
        <section className="mb-8">
          <RevenueSection />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
