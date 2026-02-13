"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function OrganizerProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    role: "",
    organizationName: "",
    designation: "",
    location: "",
    email: "",
    phone: "",
    profilePhoto: "",
  });

  // 🔥 FETCH PROFILE FROM DATABASE
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 SAVE TO DATABASE
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      setIsEditing(false);
      alert("Profile updated successfully");
    } else {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar type="organizer" />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">

            {/* HEADER */}
            <div className="bg-white p-8 rounded-xl shadow mb-8 flex items-center justify-between">
              <div className="flex items-center gap-6">

                <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.fullName?.[0] || "U"
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    {profile.fullName}
                  </h1>
                  <p className="text-gray-600">
                    {profile.designation} @ {profile.organizationName}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
                    {profile.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* ABOUT */}
            <div className="bg-white p-8 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-6">
                About
              </h2>

              {!isEditing ? (
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <Info label="Full Name" value={profile.fullName} />
                  <Info label="Role" value={profile.role} />
                  <Info label="Organization" value={profile.organizationName} />
                  <Info label="Designation" value={profile.designation} />
                  <Info label="Location" value={profile.location} />
                  <Info label="Email" value={profile.email} />
                  <Info label="Phone" value={profile.phone} />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">

                  <Input label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} />
                  <Input label="Role" name="role" value={profile.role} onChange={handleChange} />
                  <Input label="Organization" name="organizationName" value={profile.organizationName} onChange={handleChange} />
                  <Input label="Designation" name="designation" value={profile.designation} onChange={handleChange} />
                  <Input label="Location" name="location" value={profile.location} onChange={handleChange} />
                  <Input label="Email" name="email" value={profile.email} onChange={handleChange} />
                  <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} />

                  <div className="col-span-2">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}
