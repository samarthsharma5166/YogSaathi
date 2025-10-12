import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBlogById } from "../services/api";

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    async function getBlog() {
        const res = await getBlogById(id);
        if (res.data.success) {
            setBlog(res.data.blog);
        }
    }

    useEffect(() => {
        getBlog();
    }, [id]);

    if (!blog) {
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div
                    className="text-gray-600 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <motion.div
                className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {
                    console.log(`${import.meta.env.VITE_BASE_URL}/api/${blog.img}`)
                }
                {/* Blog Image */}
                <motion.img 
                    src={`${import.meta.env.VITE_BASE_URL}/${blog.img}`} // adjust backend URL if needed
                    alt={blog.title}
                    className="w-full h-90 object-contain"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                />

                {/* Blog Content */}
                <div className="p-6">
                    <motion.h1
                        className="text-3xl font-bold text-gray-900 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {blog.title}
                    </motion.h1>

                    <motion.div
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        dangerouslySetInnerHTML={{ __html: blog.content.replace(/\r\n/g, "<br/>") }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default BlogPost;
