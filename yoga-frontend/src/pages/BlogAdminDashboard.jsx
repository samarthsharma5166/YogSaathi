import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Search, Calendar, User, X, Save, Image } from 'lucide-react';
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from '../services/api';
import { useNavigate } from 'react-router-dom';

const BlogAdminDashboard = () => {
    const [blogs, setBlogs] = useState();
    const [currentView, setCurrentView] = useState('list');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        img: '',
        content: ''
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);

    const filteredBlogs = blogs?.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) 
        // blog.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function getData(){
        const res = await getAllBlogs();
        if(res.data?.success){
            setBlogs(res.data.blogs)
        }

    }
    useEffect(()=>{
        getData()
    },[])

    const handleCreateNew = () => {
        setFormData({
            title: '',
            img: '',
            content: '',
        });
        setSelectedBlog(null);
        setCurrentView('form');
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            img: blog.img,
            content: blog.content,
            authorId: blog.authorId
        });
        setSelectedBlog(blog);
        setCurrentView('form');
    };
    const navigate = useNavigate();

    const handleView = (id) => {
        // setSelectedBlog(blog);
        // setCurrentView('view');
        navigate(`/blog/${id}`)
    };

    const handleDelete = (blog) => {
        setBlogToDelete(blog);
        setShowDeleteModal(true);
    };

    const confirmDelete = async() => {
        const res = await deleteBlog(blogToDelete.id);
        if(res.data.success){
            setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id));
            setShowDeleteModal(false);
            setBlogToDelete(null);
        }
    };

    const handleSubmit = async(e) => {
        e?.preventDefault();

        if (!formData.title || !formData.content) {
            alert('Please fill in all required fields');
            return;
        }

        if (selectedBlog) {
            // Edit existing blog
            const blogData= new FormData();
            if(formData.title){
                blogData.append('title', formData?.title);
            }
            if(formData.img){
                blogData.append('img', formData?.img);
            }
            if(formData.content){
                blogData.append('content', formData?.content);
            }


            const res = await updateBlog(selectedBlog.id, blogData);

            if (res.data.success) {
                await getData();
            }

        } else {
            const blogData = new FormData();
            blogData.append('title', formData.title);
            blogData.append('img', formData.img);
            blogData.append('content', formData.content);
            const res = await createBlog(blogData);
            
            if(res.data.success){
                setBlogs([...blogs, res.data.blogs]);
            }
        }

        setCurrentView('list');
        setSelectedBlog(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="!min-h-screen bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className=" mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
                >
                    <h1 className="text-4xl font-bold  mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Blog Admin Dashboard
                    </h1>
                    <p className="text-gray-600">Manage your blog posts with ease</p>
                </motion.div>

                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="flex flex-wrap gap-4 items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentView('list')}
                                className={`px-6 py-2 rounded-lg font-medium transition-all ${currentView === 'list'
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                                        : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
                                    }`}
                            >
                                All Blogs ({blogs?.length})
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCreateNew}
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                New Blog
                            </motion.button>
                        </div>

                        {currentView === 'list' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative"
                            >
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="!pl-10 !pr-4 py-2 bg-white border border-green-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                                />
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {currentView === 'list' && (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredBlogs?.map((blog, index) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}/${blog.img}`}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {blog.content}
                                        </p>

                                        {/* <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                            <User size={16} />
                                            <span>{blog.author.name}</span>
                                            <Calendar size={16} className="ml-2" />
                                            <span>{formatDate(blog.createdAt)}</span>
                                        </div> */}

                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleView(blog.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Eye size={16} />
                                                View
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEdit(blog)}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDelete(blog)}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {filteredBlogs?.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-12"
                                >
                                    <div className="text-gray-500 text-lg">No blogs found</div>
                                    <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {currentView === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-white border border-green-200 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-green-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter blog title..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Featured Image URL
                                        </label>
                                        <div className="relative">
                                            <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="file"
                                                onChange={(e) => setFormData({ ...formData, img: e.target.files[0] })}
                                                className="w-full !pl-10 !pr-4 py-3 bg-white border border-green-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Content *
                                        </label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            rows={8}
                                            className="w-full px-4 py-3 bg-white border border-green-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                            placeholder="Write your blog content here..."
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={handleSubmit}
                                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            {selectedBlog ? 'Update Blog' : 'Create Blog'}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setCurrentView('list')}
                                            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentView === 'view' && selectedBlog && (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-white border border-green-200 rounded-xl shadow-lg overflow-hidden">
                                <div className="relative h-64 md:h-80">
                                    <img
                                        src={selectedBlog.img}
                                        alt={selectedBlog.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-6 left-6">
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                            {selectedBlog.title}
                                        </h1>
                                        <div className="flex items-center gap-4 text-white/90">
                                            <div className="flex items-center gap-2">
                                                <User size={16} />
                                                <span>{selectedBlog.author.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                <span>{formatDate(selectedBlog.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {selectedBlog.content}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleEdit(selectedBlog)}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                            Edit Post
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setCurrentView('list')}
                                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Back to List
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white border border-green-200 rounded-xl p-6 max-w-md w-full shadow-xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <Trash2 className="text-red-600" size={20} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Delete Blog Post</h3>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
                                </p>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={confirmDelete}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Delete
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BlogAdminDashboard;