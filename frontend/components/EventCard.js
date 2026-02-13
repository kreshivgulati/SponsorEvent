import Link from "next/link";
import Image from "next/image";

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link
      href={`/events/${event._id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden"
    >
      {/* Image */}
    <div className="relative h-48 w-full">
  {event.image ? (
    event.image.startsWith("data:") ? (
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover"
      />
    )
  ) : (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      No Image
    </div>
  )}
</div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Category */}
        {event.type && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              {event.type}
            </span>
          </div>
        )}

        {/* Date & Location */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{formatDate(event.date)}</span>
          <span>{event.location}</span>
        </div>

        {/* Budget & Attendees */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-500">Budget</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(event.budget)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Attendees</div>
            <div className="font-semibold text-gray-900">
              {event.attendees
                ? event.attendees.toLocaleString()
                : "0"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}