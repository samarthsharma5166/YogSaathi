import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBlogById } from "../services/api";
import SEO from "../components/SEO";

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

    const blogDescription = blog.content
        ? blog.content.replace(/<[^>]*>?/gm, "").slice(0, 155)
        : "Read this insightful yoga and wellness guide on YogSaathi.";
    const blogImageUrl = blog.img
        ? (blog.img.startsWith("http") ? blog.img : `https://yogsaathi.com/api/${blog.img}`)
        : "https://yogsaathi.com/logomain2.png";

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <SEO
                title={`${blog.title} | YogSaathi Yoga Blog`}
                description={blogDescription}
                canonical={`/blog/${id}`}
                ogType="article"
                ogImage={blogImageUrl}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": blog.title,
                    "description": blogDescription,
                    "image": blogImageUrl,
                    "publisher": {
                        "@type": "Organization",
                        "name": "YogSaathi",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://yogsaathi.com/logomain2.png"
                        }
                    }
                }}
            />
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
                    // src={`${import.meta.env.VITE_BASE_URL}/${blog.img}`} // adjust backend URL if needed
                    src={`${import.meta.env.VITE_BASE_URL}/api/${blog.img}`}
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
                        dangerouslySetInnerHTML={{
                            __html: blog.content
                                ? (/<[a-z][\s\S]*>/i.test(blog.content)
                                    ? blog.content
                                    : blog.content.replace(/\r\n|\n/g, "<br/>"))
                                : ""
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default BlogPost;
