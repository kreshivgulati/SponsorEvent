import Link from "next/link";

export default function SponsorCard({ sponsor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {sponsor.name}
        </h3>
        <p className="text-sm text-gray-600">
          {sponsor.email}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <a
          href={`mailto:${sponsor.email}`}
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Contact Sponsor
        </a>
      </div>
    </div>
  );
}