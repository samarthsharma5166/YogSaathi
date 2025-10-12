import React, { useState, useEffect } from 'react';
import { createClass, deleteClass, fetchClassesFromDb, updateClass } from '../services/api';

const YogaClassManager = () => {
    const [classes, setClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        videoLink: '',
        focusArea: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock API calls - replace with actual API endpoints
    const API_BASE = 'http://localhost:3000/api/yoga-classes'; // Adjust to your API

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const res = await fetchClassesFromDb();

            if (res.data.success){
                setClasses(res.data.data);
            }

        } catch (err) {
            setError('Failed to fetch yoga classes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.date || !formData.videoLink) {
            setError('Please fill in all required fields');
            return;
        }
        setLoading(true);
        setError('');

        try {
            if (editingClass) {

                const res = await updateClass(editingClass.id, formData);
                // Mock update
                if (res.data.success){
                    setClasses(prev => prev.map(cls =>
                        cls.id === editingClass.id
                            ? { ...cls, ...formData, date: new Date(formData.date).toISOString() }
                            : cls
                    ));
                }
            } else {
                const newClass = {
                    id: Date.now().toString(),
                    ...formData,
                    date: new Date(formData.date).toISOString(),
                    // createdAt: new Date().toISOString()
                };
                const res = await createClass(newClass);
                if (res.data.success){
                    setClasses(prev => [{ ...newClass, createdAt : res.data.data.createdAt , id: res.data.data.id}, ...prev]);
                }
            }

            closeModal();
        } catch (err) {
            setError('Failed to save yoga class');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (yogaClass) => {
        const date = new Date(yogaClass.date);

        // convert to IST in yyyy-MM-ddTHH:mm format (needed for datetime-local input)
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        const formatted = localDate.toISOString().slice(0, 16);

        setEditingClass(yogaClass);
        setFormData({
            title: yogaClass.title,
            date: formatted,  // ✅ IST time shown in input
            focusArea: yogaClass.focusArea,
            videoLink: yogaClass.videoLink,
            isActive: yogaClass.isActive
        });
        setIsModalOpen(true);
    };


    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this yoga class?')) return;

        setLoading(true);
        try {
            // await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });

            const res = await deleteClass(id);

            // Mock delete
            if (res.data.success){
                setClasses(prev => prev.filter(cls => cls.id !== id));
            }
        } catch (err) {
            setError('Failed to delete yoga class');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setEditingClass(null);
        setFormData({
            title: '',
            date: '',
            videoLink: '',
            isActive: false
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClass(null);
        setError('');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short"
        });
    };


    return (
        <div className="min-h-screen bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Yoga Classes Management</h1>
                    <button
                        onClick={openModal}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Add New Class
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && !isModalOpen && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <p className="text-green-600 mt-2">Loading...</p>
                    </div>
                )}

                {/* Classes Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((yogaClass) => (
                        <div key={yogaClass.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start ">
                                    <h3 className="text-xl font-semibold text-green-800">{yogaClass.title}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${yogaClass.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {yogaClass.isActive ? 'Pending' : 'Sent'}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><span className="font-medium">Date:</span> {formatDate(yogaClass.date)}</p>
                                    <p><span className="font-medium">Focus Area:</span> {(yogaClass.focusArea)}</p>
                                    <p className="truncate"><span className="font-medium">Video:</span> {yogaClass.videoLink}</p>
                                    <p><span className="font-medium">Created:</span> {formatDate(yogaClass.createdAt)}</p>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleEdit(yogaClass)}
                                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(yogaClass.id)}
                                        className="flex-1 !bg-red-100 hover:bg-red-200 !text-red-700 py-2 px-4 rounded font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {classes.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-green-300 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-green-600 text-lg">No yoga classes found</p>
                        <p className="text-green-500 mt-2">Create your first yoga class to get started</p>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[9999] bg-opacity-50 flex items-center justify-center p-4 ">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-green-800">
                                        {editingClass ? 'Edit Yoga Class' : 'Add New Yoga Class'}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="!text-gray-400  hover:text-gray-600 !text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter class title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-2">
                                            Focus Area
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.focusArea}
                                            onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter focus area"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-2">
                                            Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-2">
                                            Video Link
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.videoLink}
                                            onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="https://youtube.com/watch?v=..."
                                            required
                                        />
                                    </div>

                                    {/* <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                                        />
                                        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-green-700">
                                            Mark as active
                                        </label>
                                    </div> */}

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                        >
                                            {loading ? 'Saving...' : (editingClass ? 'Update' : 'Create')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YogaClassManager;