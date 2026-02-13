"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    budget: "",
    attendees: "",
    type: "",
    audience: "",
    image: "",
    socialReach: {
      instagram: "",
      linkedin: "",
      averagePostReach: "",
    },
    pastExperience: {
      isRecurring: false,
      editions: "",
      highestAttendance: "",
      notableSponsors: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login as organizer");
      router.push("/login");
    }
  }, [router]);

  // 🔹 Normal Fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Social Reach Fields
  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      socialReach: {
        ...prev.socialReach,
        [name]: value,
      },
    }));
  };

  // 🔹 Past Experience Fields
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      pastExperience: {
        ...prev.pastExperience,
        [name]: value,
      },
    }));
  };
console.log("FORM SUBMIT WORKING");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create event");
        return;
      }

      alert("✅ Event created successfully!");
      router.push("/events");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

<div className="flex-1 py-16 px-4">
  <div className="max-w-4xl mx-auto">
          <Link href="/events" className="text-indigo-600 mb-4 inline-block">
            ← Back to Events
          </Link>

          <h1 className="text-4xl font-bold text-gray-900">
  Create New Event
</h1>
<p className="text-gray-500 mt-2">
  Provide the details below to attract sponsors.
</p>

<form
  onSubmit={handleSubmit}
  className="bg-white p-12 rounded-3xl shadow-md border border-gray-200 space-y-8"
>
  {/* SECTION 1 */}
<h2 className="text-lg font-semibold text-gray-900 mt-6">
  
      Basic Information
  </h2>
  <hr className="mt-3 border-gray-200" />

            <input
              type="text"
              name="title"
              placeholder="Event Title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event Description"
              className="input-field"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              className="input-field"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="budget"
              placeholder="Budget (INR)"
              className="input-field"
              value={formData.budget}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="attendees"
              placeholder="Expected Attendees"
              className="input-field"
              value={formData.attendees}
              onChange={handleChange}
            />

            <input
              type="text"
              name="image"
              placeholder="Event Banner Image URL"
              className="input-field"
              value={formData.image}
              onChange={handleChange}
            />
<h2 className="text-lg font-semibold text-gray-900 mt-6">
      Audience & Reach
  </h2>
<hr className="mt-3 border-gray-200" />
            <input
              type="number"
              name="instagram"
              placeholder="Instagram Followers"
              className="input-field"
              value={formData.socialReach.instagram}
              onChange={handleSocialChange}
            />

            <input
              type="number"
              name="linkedin"
              placeholder="LinkedIn Followers"
              className="input-field"
              value={formData.socialReach.linkedin}
              onChange={handleSocialChange}
            />

            <input
              type="number"
              name="averagePostReach"
              placeholder="Average Post Reach"
              className="input-field"
              value={formData.socialReach.averagePostReach}
              onChange={handleSocialChange}
            />

            <h3 className="text-lg font-semibold pt-4">
              Past Event Experience
            </h3>

           <select
  name="isRecurring"
  value={formData.pastExperience.isRecurring}
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      pastExperience: {
        ...prev.pastExperience,
        isRecurring: e.target.value === "true",
      },
    }))
  }
  className="input-field"
>
  <option value="">Is this recurring?</option>
  <option value="true">Yes</option>
  <option value="false">No</option>
</select>
            <input
              type="number"
              name="editions"
              placeholder="Number of Past Editions"
              className="input-field"
              value={formData.pastExperience.editions}
              onChange={handleExperienceChange}
            />

            <input
              type="number"
              name="highestAttendance"
              placeholder="Highest Past Attendance"
              className="input-field"
              value={formData.pastExperience.highestAttendance}
              onChange={handleExperienceChange}
            />

            <input
              type="text"
              name="notableSponsors"
              placeholder="Notable Past Sponsors"
              className="input-field"
              value={formData.pastExperience.notableSponsors}
              onChange={handleExperienceChange}
            />

            <button
              type="submit"
              disabled={loading}
className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}