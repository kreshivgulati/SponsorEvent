"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    budget: "",
    attendees: "",
    type: "conference",
    audience: "tech",
    image: "",
    socialReach: {
      instagram: "",
      linkedin: "",
      averagePostReach: "" // Make sure this matches
    },
    pastExperience: {
      isRecurring: false,
      editions: "",
      highestAttendance: "",
      notableSponsors: ""
    }
  });

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    console.log("Fetching event with ID:", eventId);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json();
    console.log("API Response:", data);

    if (data.success) {
      const event = data.event;
      console.log("Fetched event:", event);
      
      // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      // Safely handle notableSponsors (could be array, string, or null)
      let notableSponsorsValue = "";
      if (event.pastExperience?.notableSponsors) {
        if (Array.isArray(event.pastExperience.notableSponsors)) {
          notableSponsorsValue = event.pastExperience.notableSponsors.join(", ");
        } else {
          // If it's already a string, use it as is
          notableSponsorsValue = String(event.pastExperience.notableSponsors);
        }
      }

      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        location: event.location || "",
        budget: event.budget || "",
        attendees: event.attendees || "",
        type: event.type || "conference",
        audience: event.audience || "tech",
        image: event.image || "",
        socialReach: {
          instagram: event.socialReach?.instagram || "",
          linkedin: event.socialReach?.linkedin || "",
          averagePostReach: event.socialReach?.averagePostReach || ""
        },
        pastExperience: {
          isRecurring: event.pastExperience?.isRecurring || false,
          editions: event.pastExperience?.editions || "",
          highestAttendance: event.pastExperience?.highestAttendance || "",
          notableSponsors: notableSponsorsValue
        }
      });
    }
  } catch (err) {
    console.error("Error fetching event:", err);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const token = localStorage.getItem("token");
    
    // Process notableSponsors - convert array to string for backend
    let notableSponsorsValue = "";
    if (formData.pastExperience.notableSponsors) {
      if (Array.isArray(formData.pastExperience.notableSponsors)) {
        // If it's already an array, join it
        notableSponsorsValue = formData.pastExperience.notableSponsors.join(", ");
      } else {
        // If it's a string, keep it as is
        notableSponsorsValue = formData.pastExperience.notableSponsors;
      }
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      budget: Number(formData.budget),
      attendees: Number(formData.attendees),
      type: formData.type,
      audience: formData.audience,
      image: formData.image,
      socialReach: {
        instagram: Number(formData.socialReach.instagram) || 0,
        linkedin: Number(formData.socialReach.linkedin) || 0,
        averagePostReach: Number(formData.socialReach.averagePostReach) || 0
      },
      pastExperience: {
        isRecurring: formData.pastExperience.isRecurring,
        editions: Number(formData.pastExperience.editions) || 0,
        highestAttendance: Number(formData.pastExperience.highestAttendance) || 0,
        notableSponsors: notableSponsorsValue
      }
    };

    console.log("Submitting event data:", eventData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();

    if (data.success) {
      alert("Event updated successfully!");
      router.push("/organizer/events");
    } else {
      alert("Error updating event: " + data.message);
    }
  } catch (err) {
    console.error("Error updating event:", err);
    alert("Failed to update event");
  } finally {
    setSaving(false);
  }
};

  // ONLY ONE loading check at the bottom
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading event details...</p>
                </div>
              </div>
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Edit Event</h1>
              <p className="text-gray-600">Update your event details</p>
            </div>
            <Link href="/organizer/events" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </Link>
          </div>

          {/* ADD THE FORM BACK HERE */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget ($) *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Attendees *
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="networking">Networking</option>
                    <option value="trade-show">Trade Show</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="tech">Tech</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Social Reach */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Social Media Reach</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Followers
                  </label>
                  <input
                    type="number"
                    name="socialReach.instagram"
                    value={formData.socialReach.instagram}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Followers
                  </label>
                  <input
                    type="number"
                    name="socialReach.linkedin"
                    value={formData.socialReach.linkedin}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avg Post Reach
                  </label>
                  <input
                    type="number"
                    name="socialReach.averagePostReach"
                    value={formData.socialReach.averagePostReach}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Past Experience */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Past Experience</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="pastExperience.isRecurring"
                    checked={formData.pastExperience.isRecurring}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    This is a recurring event
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Editions
                    </label>
                    <input
                      type="number"
                      name="pastExperience.editions"
                      value={formData.pastExperience.editions}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Attendance
                    </label>
                    <input
                      type="number"
                      name="pastExperience.highestAttendance"
                      value={formData.pastExperience.highestAttendance}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notable Past Sponsors (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="pastExperience.notableSponsors"
                      value={formData.pastExperience.notableSponsors}
                      onChange={handleChange}
                      placeholder="Company A, Company B, Company C"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6 flex justify-end space-x-4">
              <Link
                href="/organizer/events"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>

    <Footer />
  </div>
);
}