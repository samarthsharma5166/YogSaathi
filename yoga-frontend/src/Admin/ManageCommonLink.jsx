import React, { useState, useEffect } from "react";
import axios from "axios";
import { createOrUpdateCommonLink, getCommonLink } from "../services/api";

const ManageCommonLink = () => {
  const [link, setLink] = useState("");
  const [ref, setRef] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const fetchCommonLink = async () => {
      try {
        const response = await getCommonLink();
        const { data } = response.data;
        if (data) {
          setLink(data.link);
          setRef(data.ref);
          setStartDate(new Date(data.startDate).toISOString().split("T")[0]);
          setExpiryDate(new Date(data.expiryDate).toISOString().split("T")[0]);
        }
      } catch (error) {
        console.error("Error fetching common link:", error);
      }
    };

    fetchCommonLink();
  }, []);

  useEffect(() => {
    setLink(`https://yogsaathi.com/class/join?ref=${ref}`);
  }, [ref]);

  const handleSave = async () => {
    try {
      await createOrUpdateCommonLink({
        ref,
        startDate,
        expiryDate,
      });

      alert("Common link saved successfully!");
    } catch (error) {
      console.error("Error saving common link:", error);
      alert("Failed to save common link.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Common Link</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Ref</label>
        <input
          type="text"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Link</label>
        <input
          type="text"
          value={link}
          readOnly
          className="w-full p-2 border rounded bg-gray-200"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default ManageCommonLink;
