import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getAllComplaints } from '../../api/complaintAPI';

const Analytics = () => {
  const [complaintData, setComplaintData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [resolutionRate, setResolutionRate] = useState(0); 

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const response = await getAllComplaints();
      const complaints = response.data.complaints || [];

      // Severity breakdown
      const severityCount = complaints.reduce((acc, complaint) => {
        acc[complaint.severity] = (acc[complaint.severity] || 0) + 1;
        return acc;
      }, {});
      const severityData = Object.entries(severityCount).map(([severity, count]) => ({
        name: severity,
        value: count
      }));

      // Product type breakdown
      const productCount = complaints.reduce((acc, complaint) => {
        acc[complaint.productType] = (acc[complaint.productType] || 0) + 1;
        return acc;
      }, {});
      const productTypeData = Object.entries(productCount).map(([product, count]) => ({
        name: product,
        complaints: count
      }));

      // Resolution rate calculation
      const resolvedCount = complaints.filter(
        (c) => c.status === 'resolved' || c.status === 'closed'
      ).length;
      const totalCount = complaints.length;
      const calculatedRate = totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : 0;

      setComplaintData(severityData);
      setProductData(productTypeData);
      setResolutionRate(calculatedRate); 
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Complaints by Severity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complaintData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Complaints by Product Type</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="complaints" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Total Complaints */}
        <div className="bg-blue-100 text-blue-900 p-4 rounded text-center">
          <p className="text-3xl font-bold">
            {complaintData.reduce((sum, item) => sum + item.value, 0)}
          </p>
          <p className="text-sm mt-1">Total Complaints</p>
        </div>

        {/* Urgent Complaints */}
        <div className="bg-red-100 text-red-900 p-4 rounded text-center">
          <p className="text-3xl font-bold">
            {complaintData.find(item => item.name === 'Urgent')?.value || 0}
          </p>
          <p className="text-sm mt-1">Urgent Complaints</p>
        </div>

        {/* High Priority */}
        <div className="bg-yellow-100 text-yellow-900 p-4 rounded text-center">
          <p className="text-3xl font-bold">
            {complaintData.find(item => item.name === 'High')?.value || 0}
          </p>
          <p className="text-sm mt-1">High Priority</p>
        </div>

        {/* Resolution Rate */}
        <div className="bg-green-100 text-green-900 p-4 rounded text-center">
          <p className="text-3xl font-bold">{resolutionRate}%</p>
          <p className="text-sm mt-1">Resolution Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
