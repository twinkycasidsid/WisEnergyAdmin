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
        // If the result is undefined or null, set it to an empty array
        setTotalDevices(result || []);
      } catch (error) {
        setTotalDevices([]); // Set to empty array in case of error
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

  // Feedback Type Breakdown
  const feedbackTypeData = [
    { name: "Bug Report", value: 0 },
    { name: "Suggestion", value: 0 },
    { name: "Question", value: 0 },
  ];

  feedback.forEach((item) => {
    if (item.type === "Bug Report") feedbackTypeData[0].value++;
    else if (item.type === "Suggestion") feedbackTypeData[1].value++;
    else feedbackTypeData[2].value++;
  });

  // Device Status Overview
  const deviceStatusData = [
    { name: "paired", value: 0 },
    { name: "unpaired", value: 0 },
  ];

  // Make sure totalDevices is an array before iterating
  if (Array.isArray(totalDevices)) {
    totalDevices.forEach((device) => {
      if (device.status === "paired") deviceStatusData[0].value++;
      else deviceStatusData[1].value++;
    });
  }

  // Rating Distribution
  const ratingDistribution = [
    { name: "1 Star", value: 0 },
    { name: "2 Star", value: 0 },
    { name: "3 Star", value: 0 },
    { name: "4 Star", value: 0 },
    { name: "5 Star", value: 0 },
  ];

  reviews.forEach((review) => {
    const rating = review.rating;
    if (rating === 1) ratingDistribution[0].value++;
    else if (rating === 2) ratingDistribution[1].value++;
    else if (rating === 3) ratingDistribution[2].value++;
    else if (rating === 4) ratingDistribution[3].value++;
    else if (rating === 5) ratingDistribution[4].value++;
  });

  const FEEDBACK_COLORS = ["#24924B", "#43A866", "#90D6B0"];
  const COLORS = ["#43A866", "#90D6B0"];

  const recentReviews = reviews
    .sort((a, b) => {
      // Sort by date, if dates are equal, fallback to ID
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      if (dateA !== dateB) {
        return dateB - dateA; // Newest first
      } else {
        return b.id - a.id; // Fallback to ID for tie-breaking
      }
    })
    .slice(0, 4); // Get the first 5 reviews

  const recentFeedback = feedback
    .sort((a, b) => {
      // Sort by date, if dates are equal, fallback to ID
      const dateA = new Date(a.date_created).getTime();
      const dateB = new Date(b.date_created).getTime();

      if (dateA !== dateB) {
        return dateB - dateA; // Newest first
      } else {
        return b.id - a.id; // Fallback to ID for tie-breaking
      }
    })
    .slice(0, 4); // Get the first 5 reviews

  return (
    <div className="p-6 space-y-4">
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#24924B] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Total Users</h3>
            <p className="text-3xl font-bold">{totalUsers?.length}</p>
          </div>
          <Users className="w-10 h-10 opacity-80" />
        </div>

        {/* Total Devices */}
        <div className="bg-[#4a8761] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Total Devices</h3>
            <p className="text-3xl font-bold">{totalDevices?.length}</p>
          </div>
          <Plug className="w-10 h-10 opacity-80" />
        </div>

        {/* Average Rating */}
        <div className="bg-[#027833] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Average Rating</h3>
            <p className="text-3xl font-bold">
              {avgRating ? avgRating.toFixed(2) : "N/A"}
            </p>
          </div>
          <Star className="w-10 h-10 opacity-80" />
        </div>

        {/* Total Feedback */}
        <div className="bg-[#43A866] text-white rounded-lg p-6 shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg">Total Feedback</h3>
            <p className="text-3xl font-bold">{feedback?.length}</p>
          </div>
          <MessageSquare className="w-10 h-10 opacity-80" />
        </div>
      </div>

      {/* Tables and Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Reviews + Feedback */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow p-4 h-63 overflow-x-auto">
            <h3 className="font-semibold mb-3">Recent Reviews</h3>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-200 text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Rating</th>
                  <th className="p-2">Message</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recentReviews?.map((review) => (
                  <tr key={review.id}>
                    <td className="p-2">{review.id}</td>
                    <td className="p-2">{review.rating} ⭐</td>
                    <td className="p-2">{review.message}</td>
                    <td className="p-2">{review.email}</td>
                    <td className="p-2">{review.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-lg shadow p-4 h-64 overflow-x-auto">
            <h3 className="font-semibold mb-3">Recent Feedback</h3>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-200 text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Message</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Date Submitted</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentFeedback?.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.id}</td>
                    <td className="p-2">{item.type}</td>
                    <td className="p-2">{item.message}</td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2">{item.date_created}</td>
                    <td className="p-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Charts in one card */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 h-131">
          {/* Feedback Type Breakdown */}
          <div>
            <h3 className="font-semibold mb-2">Feedback Type Breakdown</h3>
            <ResponsiveContainer width="100%" height={110}>
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

          {/* Device Status Overview */}
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

          {/* Rating Distribution */}
          <div>
            <h3 className="font-semibold mb-2">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={110}>
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
