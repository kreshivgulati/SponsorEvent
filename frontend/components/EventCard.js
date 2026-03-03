"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function EventCard({ event, isOrganizer = false, onDelete }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/organizer/events/${event._id}/edit`);
  };

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(event._id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="relative group">
        <Link
          href={`/events/${event._id}`}
          className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden"
        >
          {/* Image */}
          <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-200">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
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
              <span>
                {formatDate(event.startDate)}
                {event.endDate && ` - ${formatDate(event.endDate)}`}
              </span>
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
                  {event.attendees ? event.attendees.toLocaleString() : "0"}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Organizer Controls - only show if isOrganizer is true */}
        {isOrganizer && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={handleEditClick}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}