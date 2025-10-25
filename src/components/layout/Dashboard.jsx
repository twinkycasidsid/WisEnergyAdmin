import React, { useEffect, useState } from "react";
import { Users, Plug, Star, MessageSquare } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import {
  fetchAllUsers,
  fetchAllDevices,
  fetchAllReviews,
  fetchAllFeedbacks,
} from "../../../services/apiService";

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalDevices, setTotalDevices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetchAllUsers();
      setTotalUsers(result);
    };
    fetchUsers();

    const fetchDevices = async () => {
      try {
        const result = await fetchAllDevices();
        setTotalDevices(result || []);
      } catch (error) {
        setTotalDevices([]);
        console.error("Failed to fetch devices:", error);
      }
    };
    fetchDevices();

    const fetchFeedback = async () => {
      const result = await fetchAllFeedbacks();
      setFeedback(result);
    };
    fetchFeedback();

    const fetchReviews = async () => {
      const result = await fetchAllReviews();
      setReviews(result);

      if (result?.length > 0) {
        const sum = result.reduce((acc, r) => acc + r.rating, 0);
        setAvgRating(sum / result.length);
      }
    };
    fetchReviews();
  }, []);

  // ---------- MOCK SUBSCRIPTION DATA ----------
  const subscriptionStatusData = [
    { name: "Active", value: 75 },
    { name: "Expired", value: 25 },
  ];

  const subscriptionGrowthData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 25 },
    { month: "Apr", value: 50 },
    { month: "May", value: 90 },
    { month: "Jun", value: 85 },
  ];

  const planDistributionData = [
    { name: "Free", value: 450 },
    { name: "Monthly", value: 300 },
    { name: "Yearly", value: 450 },
  ];

  const feedbackTypeData = [
    { name: "Bug Report", value: 2 },
    { name: "Suggestion", value: 3 },
    { name: "Question", value: 3 },
  ];

  const deviceStatusData = [
    { name: "paired", value: 2 },
    { name: "unpaired", value: 1 },
  ];

  const ratingDistribution = [
    { name: "1 Star", value: 0 },
    { name: "2 Star", value: 0 },
    { name: "3 Star", value: 0 },
    { name: "4 Star", value: 1 },
    { name: "5 Star", value: 8 },
  ];

  const FEEDBACK_COLORS = ["#24924B", "#43A866", "#90D6B0"];
  const COLORS = ["#43A866", "#90D6B0"];

  return (
    <div className="p-6 space-y-4">
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#24924B] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Total Users</h3>
            <p className="text-3xl font-bold">{totalUsers?.length || 9}</p>
          </div>
          <Users className="w-10 h-10 opacity-80" />
        </div>

        <div className="bg-[#4a8761] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Total Devices</h3>
            <p className="text-3xl font-bold">{totalDevices?.length || 3}</p>
          </div>
          <Plug className="w-10 h-10 opacity-80" />
        </div>

        <div className="bg-[#027833] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Average Rating</h3>
            <p className="text-3xl font-bold">
              {avgRating ? avgRating.toFixed(2) : "5.00"}
            </p>
          </div>
          <Star className="w-10 h-10 opacity-80" />
        </div>

        <div className="bg-[#43A866] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Total Feedback</h3>
            <p className="text-3xl font-bold">{feedback?.length || 8}</p>
          </div>
          <MessageSquare className="w-10 h-10 opacity-80" />
        </div>
      </div>

      {/* Charts and analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SIDE: Subscription Analytics */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Row 1: Status + Growth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subscription Growth Over Time */}
            <div className="bg-white rounded-lg shadow p-4 md:col-span-2">
              <h3 className="font-semibold mb-3">
                Subscription Growth Over Time
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={[
                    { month: "Jan", value: 20 },
                    { month: "Feb", value: 35 },
                    { month: "Mar", value: 25 },
                    { month: "Apr", value: 50 },
                    { month: "May", value: 90 },
                    { month: "Jun", value: 85 },
                    { month: "Jul", value: 92 },
                    { month: "Aug", value: 98 },
                    { month: "Sep", value: 120 },
                    { month: "Oct", value: 110 },
                    { month: "Nov", value: 130 },
                    { month: "Dec", value: 145 },
                  ]}
                >
                  <XAxis dataKey="month" stroke="#4B5563" />
                  <YAxis stroke="#4B5563" />
                  <Tooltip formatter={(v) => `${v} new`} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#43A866"
                    strokeWidth={3}
                    fill="#E8F5E9"
                    dot={{ fill: "#24924B", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Plan Distribution + Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subscription Plan Distribution */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">
                Subscription Plan Distribution
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  layout="vertical"
                  data={planDistributionData}
                  margin={{ left: 10 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#43A866" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Two Separate Cards */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center flex flex-col justify-center">
                <h3 className="text-lg text-gray-700 font-medium mb-1">
                  Total Revenue
                </h3>
                <p className="text-3xl font-bold text-[#24924B]">₱78,220</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center flex flex-col justify-center">
                <h3 className="text-lg text-gray-700 font-medium mb-1">
                  New Subscriptions (Last 7 Days)
                </h3>
                <p className="text-3xl font-bold text-[#24924B]">25</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Feedback + Devices + Ratings */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 h-auto">
          <div>
            <h3 className="font-semibold mb-2">Feedback Type Breakdown</h3>
            <ResponsiveContainer width="100%" height={109}>
              <PieChart>
                <Pie data={feedbackTypeData} dataKey="value" outerRadius={55}>
                  {feedbackTypeData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={FEEDBACK_COLORS[i % FEEDBACK_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Device Status Overview</h3>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={deviceStatusData} dataKey="value" outerRadius={55}>
                  {deviceStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={105}>
              <BarChart data={ratingDistribution}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#43A866" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
