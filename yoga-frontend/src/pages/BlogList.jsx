import React, { useEffect, useState } from "react";
import { getAllBlogs } from "../services/api";
import "../pages/CSS/BlogList.css";
import Slider from "react-slick";

export default function PublicBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBlogData = async () => {
    try {
      setLoading(true);
      const res = await getAllBlogs();
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogData();
  }, []);

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-[100px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[100px] bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2e7d32] mb-4">
            🧘‍♀️ YogSaathi Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insights, tips, and wisdom for your yoga journey
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/${blog.img}`}
                      alt={blog.title}
                      className="w-full h-full object-cover relative group-hover:scale-105 transition-transform duration-300"
              
                    />
                  {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div> */}
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                    {blog.title}
                  </h2>

                  {/* Content Preview */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateContent(blog.content)}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>By Author</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>

                  {/* Read More Button */}
                  <button onClick={() => window.location.href = `/blog/${blog.id}`} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                    <span>Read More</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No blogs available
            </h3>
            <p className="text-gray-500">
              Check back later for new yoga insights and tips!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}