"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

// Currency formatting function for Indian Rupees
const formatIndianRupees = (amount) => {
  if (!amount && amount !== 0) return "₹0";
  
  // For amounts in crores (1,00,00,000)
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  // For amounts in lakhs (1,00,000)
  else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  // For amounts in thousands
  else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  
  return `₹${amount}`;
};

// Format number with Indian numbering system (uses commas for thousands/lakhs/crores)
const formatIndianNumber = (num) => {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalInterests: 0,
    totalChats: 0,
    totalViews: 0,
    averageBudget: 0,
    totalAttendees: 0,
    topCategories: [],
    recentInterests: [],
    eventsByMonth: [],
    sponsorshipMetrics: {
      totalPotential: 0,
      averagePerEvent: 0,
      conversionRate: 0,
      responseRate: 0,
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/organizer`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration - updated with Indian values
  const mockAnalytics = {
    totalEvents: 12,
    totalInterests: 156,
    totalChats: 89,
    totalViews: 2450,
    averageBudget: 250000, // ₹2.5 Lakhs
    totalAttendees: 3450,
    topCategories: [
      { name: "Tech", count: 8 },
      { name: "Business", count: 5 },
      { name: "Healthcare", count: 3 },
    ],
    sponsorshipMetrics: {
      totalPotential: 12500000, // ₹1.25 Crore
      averagePerEvent: 1041667, // ₹10.4 Lakhs
      conversionRate: 68,
      responseRate: 82,
    },
    recentInterests: [
      { event: "Tech Conference 2024", sponsors: 12, date: "2024-03-15" },
      { event: "Startup Summit", sponsors: 8, date: "2024-03-14" },
      { event: "Developer Workshop", sponsors: 5, date: "2024-03-13" },
    ],
    eventsByMonth: [
      { month: "Jan", count: 2 },
      { month: "Feb", count: 3 },
      { month: "Mar", count: 4 },
      { month: "Apr", count: 3 },
    ],
  };

  const data = mockAnalytics; // Replace with analytics data from API

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F3F7FF]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">
                Track your event performance and sponsorship metrics
              </p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                icon={<CalendarIcon className="h-6 w-6" />}
                label="Total Events"
                value={data.totalEvents}
                bgColor="bg-blue-50"
                textColor="text-blue-600"
              />
              <MetricCard
                icon={<HeartIcon className="h-6 w-6" />}
                label="Total Interests"
                value={formatIndianNumber(data.totalInterests)}
                bgColor="bg-green-50"
                textColor="text-green-600"
              />
              <MetricCard
                icon={<ChatBubbleLeftIcon className="h-6 w-6" />}
                label="Total Chats"
                value={formatIndianNumber(data.totalChats)}
                bgColor="bg-purple-50"
                textColor="text-purple-600"
              />
              <MetricCard
                icon={<EyeIcon className="h-6 w-6" />}
                label="Total Views"
                value={formatIndianNumber(data.totalViews)}
                bgColor="bg-orange-50"
                textColor="text-orange-600"
              />
            </div>

            {/* Sponsorship Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                icon={<CurrencyDollarIcon className="h-6 w-6" />}
                label="Avg. Sponsorship Value"
                value={formatIndianRupees(data.sponsorshipMetrics.averagePerEvent)}
                bgColor="bg-emerald-50"
                textColor="text-emerald-600"
              />
              <MetricCard
                icon={<ChartBarIcon className="h-6 w-6" />}
                label="Conversion Rate"
                value={`${data.sponsorshipMetrics.conversionRate}%`}
                bgColor="bg-indigo-50"
                textColor="text-indigo-600"
              />
              <MetricCard
                icon={<UserGroupIcon className="h-6 w-6" />}
                label="Response Time"
                value="2.4 hrs"
                bgColor="bg-amber-50"
                textColor="text-amber-600"
              />
              <MetricCard
                icon={<ChartBarIcon className="h-6 w-6" />}
                label="Top Category"
                value={data.topCategories[0]?.name || "Tech"}
                bgColor="bg-rose-50"
                textColor="text-rose-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Events by Month */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Events by Month</h2>
                <div className="h-64 flex items-end justify-around">
                  {data.eventsByMonth.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-blue-500 rounded-t-lg"
                        style={{ height: `${item.count * 30}px` }}
                      ></div>
                      <span className="mt-2 text-sm text-gray-600">{item.month}</span>
                      <span className="text-xs font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Top Event Categories</h2>
                <div className="space-y-4">
                  {data.topCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="font-medium">{category.count} events</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 rounded-full h-2"
                          style={{ width: `${(category.count / data.totalEvents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Interests & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Interests */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Sponsor Interests</h2>
                <div className="space-y-4">
                  {data.recentInterests.map((interest, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{interest.event}</p>
                        <p className="text-sm text-gray-500">{interest.sponsors} sponsors interested</p>
                      </div>
                      <span className="text-xs text-gray-400">{interest.date}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/organizer/interests" 
                  className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                >
                  View all interests →
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <QuickStat 
                    label="Total Attendees" 
                    value={formatIndianNumber(data.totalAttendees)} 
                    change="+12%" 
                  />
                  <QuickStat 
                    label="Avg Budget" 
                    value={formatIndianRupees(data.averageBudget)} 
                    change="+5%" 
                  />
                  <QuickStat 
                    label="Response Rate" 
                    value={`${data.sponsorshipMetrics.responseRate}%`} 
                    change="+3%" 
                  />
                  <QuickStat 
                    label="Total Potential" 
                    value={formatIndianRupees(data.sponsorshipMetrics.totalPotential)} 
                    change="+8%" 
                  />
                </div>

                {/* Tips Section */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">💡 Pro Tip</h3>
                  <p className="text-sm text-blue-700">
                    Events in the Tech category receive 40% more sponsor interests. Consider adding more tech-focused events!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, label, value, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg ${textColor}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}

// Quick Stat Component
function QuickStat({ label, value, change }) {
  const isPositive = change.startsWith('+');
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
  );
}