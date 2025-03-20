"use client";
import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { Pencil, Trash } from "lucide-react"; // Import icons from lucide-react

interface Subscription {
  _id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [name, setName] = useState("free");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [duration, setDuration] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
    const hasFetched = useRef(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axiosInstance.get("/subscription/admin/plans");
        setSubscriptions(res.data.subscriptions);
      } catch (error) {
      }
    };
    fetchSubscriptions();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(null); // Reset editing state
    // Reset form fields
    setName("free");
    setDescription("");
    setPrice(0);
    setFeatures([]);
    setDuration(1);
  };

  // Create new subscription
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/subscription/plans", {
        name,
        description,
        price,
        features,
        duration,
      });
      setSubscriptions([...subscriptions, res.data.subscription]);
      closeModal(); // Close modal after successful creation
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubscription) return;

    try {
      const updatedData = {
        description,
        price,
        features,
        duration,
        isActive: editingSubscription.isActive, // Ensure isActive is included
      };

      const res = await axiosInstance.put(
        `/subscription/plans/${editingSubscription._id}`,
        updatedData
      );

      // Update the subscription in the state
      setSubscriptions(
        subscriptions.map((sub) =>
          sub._id === editingSubscription._id ? res.data.subscription : sub
        )
      );
      closeModal(); // Close modal after successful update
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  // Toggle isActive status
  const toggleActiveStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await axiosInstance.put(`/subscription/plans/${id}`, {
        isActive: !isActive,
      });

      // Update the subscription in the state
      setSubscriptions(
        subscriptions.map((sub) =>
          sub._id === id ? { ...sub, isActive: !isActive } : sub
        )
      );
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  // Delete subscription
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/subscription/plans/${id}`);
      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Subscriptions</h1>

      {/* Button to open modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Create Subscription
      </button>

      {/* Subscription Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingSubscription ? "Edit Subscription" : "Create Subscription"}
            </h2>
            <form onSubmit={editingSubscription ? handleEdit : handleCreate}>
              {/* Plan Name */}
              <label className="block mt-4">
                Plan Name
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value as typeof name)}
                  className="w-full p-2 border rounded"
                  disabled={!!editingSubscription} // Disable if editing
                  required
                >
                  <option value="free">Free</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </label>

              {/* Description */}
              <label className="block mt-4">
                Description
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </label>

              {/* Price */}
              <label className="block mt-4">
                Price
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  required
                />
              </label>

              {/* Features */}
              <label className="block mt-4">
                Features (comma-separated)
                <input
                  type="text"
                  value={features.join(",")}
                  onChange={(e) =>
                    setFeatures(e.target.value.split(",").map((f) => f.trim()))
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </label>

              {/* Duration */}
              <label className="block mt-4">
                Duration (months)
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  required
                />
              </label>

              {/* Toggle isActive Status */}
              {editingSubscription && (
                <label className="block mt-4">
                  Status
                  <select
                    value={editingSubscription.isActive ? "active" : "inactive"}
                    onChange={(e) =>
                      setEditingSubscription({
                        ...editingSubscription,
                        isActive: e.target.value === "active",
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {editingSubscription ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Features</th>
            <th className="p-3 text-left">Duration</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub._id}>
              <td className="p-3">{sub.name}</td>
              <td className="p-3">{sub.description}</td>
              <td className="p-3">${sub.price}</td>
              <td className="p-3">{sub.features.join(", ")}</td>
              <td className="p-3">{sub.duration} months</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded ${
                    sub.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {sub.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    setEditingSubscription(sub);
                    setName(sub.name);
                    setDescription(sub.description);
                    setPrice(sub.price);
                    setFeatures(sub.features);
                    setDuration(sub.duration);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  <Pencil size={16} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="bg-red-600 text-white p-2 rounded"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionManagement;