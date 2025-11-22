import { useState, useMemo, useEffect } from 'react';
import { createScheduledMessage, deleteScheduledMessage, editScheduledMessage, getAllScheduledMessages, getClassesfromDb } from '../services/api';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

// Mock template data structure
const templateName = [
    {
        name: "session_reminder__orientation_for_free_trial",
        inputs: [
            { label: "Session date", name: "date", type: "date", required: true },
            { label: "Session time", name: "time", type: "time", required: true },
            { label: "Session Link", name: "sessionLink", type: "text", required: true },
        ]
    },
    {
        name: "class_reminder",
        inputs: [
            { label: "Class Name", name: "classId", type: "select", required: true },
        ]
    },
    {
        name: "your_weekly_yoga_schedule__access_details",
        inputs: [
            { label: "Monday session detail", name: "monday", type: "text", required: true },
            { label: "Tuesday session detail", name: "tuesday", type: "text", required: true },
            { label: "Wednesday session detail", name: "wednesday", type: "text", required: true },
            { label: "Thursday session detail", name: "thursday", type: "text", required: true },
            { label: "Friday session detail", name: "friday", type: "text", required: true },
            { label: "Saturday session detail", name: "saturday", type: "text", required: true },
            { label: "Sunday session detail", name: "sunday", type: "text", required: true },

        ]
    },
    {
        name: "join_session__mark_attendance",
        inputs: [
            
        ]
    },
    {
        name: "session_reminder",
        inputs: [
            { label: "Session Date", name: "date", type: "date", required: true },
            { label: "Session Time", name: "time", type: "time", required: true },
            { label: "Session Link", name: "sessionLink", type: "text", required: true },
        ]
    },
    {
        name: "giftwellness_yogsaathi",
        inputs:[]
    },
    {
        name: "weekly_attendance_status__yogsaathi_sessions",
        inputs:[]
    },
    {
        name:"yoga_subscription_offer",
        inputs:[]
    },
    {
        name: "subscription_invitation",
        inputs: []
    },
    {
        name:"share_wellness_14_days_of_free_yoga",
        inputs:[]
    },
    {
        name:"vijayadashami_greetings",
        inputs:[]
    },
    {
        name:"vijaydashmi_greetings_and_referrals",
        inputs:[]
    },
    {
        name:"yoga_trial_midway_update__reminder",
        inputs:[]
    },
    {
        name:"yogsaathi_contact_detail",
        inputs:[]
    },
    {
        name:"festival_greetings",
        inputs:[]
    },
    {
        name:"yoga_offer_reminder",
        inputs:[]
    },
    {
        name:"yogsaathi_communication_channels",
        inputs:[]
    },
    {
        name:"free_online_yoga_trial_reminder",
        inputs:[]
    },
    {
        name: "yoga_class_time_details_as_per_ist",
        inputs: []

    }
];

export default function ScheduledMessageManager() {
    const [messages, setMessages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        templateName: '',
        scheduledDate: '',
        targetAudience: '',
        payload: {}
    });

    async function getScheduledMessages() {
        try {
            const res = await getAllScheduledMessages();
            setMessages(res.messages);
        } catch (error) {
            toast.error(error.response.data.error || error.response.data.message);
        }
    }

    async function getClasses() {
        try {
            const res = await getClassesfromDb();
            setClasses(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch classes');
            console.error(error);
        }
    }

    useEffect(() => {
        if (formData.templateName === 'class_reminder') {
            getClasses();
        }
    }, [formData.templateName]);

    useEffect(() => {
        setLoading(true);
        getScheduledMessages().finally(() => setLoading(false));
    }, [])

    // Get the selected template configuration
    const selectedTemplate = useMemo(() => {
        return templateName.find(template => template.name === formData.templateName);
    }, [formData.templateName]);

    const filteredMessages = useMemo(() => {
        return messages.filter(message =>
            message.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(message.payload).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [messages, searchTerm]);

    const handleAddNew = () => {
        setEditingMessage(null);
        setFormData({ templateName: '', scheduledDate: '', targetAudience: '', payload: {} });
        setShowForm(true);
    };


    const toISTDateTimeLocal = (utcDate) => {
        const date = new Date(utcDate);
        // Shift to IST (+5:30)
        const offsetMs = 5.5 * 60 * 60 * 1000;
        const ist = new Date(date.getTime() + offsetMs);
        return ist.toISOString().slice(0, 16);
    };


    const handleEdit = (message) => {
        setEditingMessage(message);
        setFormData({
            templateName: message.templateName,
            scheduledDate: toISTDateTimeLocal(message.scheduledDate),
            targetAudience: message.targetAudience || '',
            payload: message.payload
        });

        // If it's a class reminder, fetch classes
        if (message.templateName === 'class_reminder') {
            getClasses();
        }

        setShowForm(true);
    };

    const handleDelete = async(id) => {
        if (window.confirm('Are you sure you want to delete this scheduled message?')) {
            const res = await deleteScheduledMessage(id);
            if(res.success){
                setMessages(messages.filter(message => message.id !== res.id));
            }
        }
    };

    const handleTemplateChange = (templateValue) => {
        const template = templateName.find(t => t.name === templateValue);
        const initialPayload = {};

        // Initialize payload with empty values based on template inputs
        if (template) {
            template.inputs.forEach(input => {
                switch (input.type) {
                    case 'boolean':
                        initialPayload[input.name] = false;
                        break;
                    case 'number':
                        initialPayload[input.name] = 0;
                        break;
                    default:
                        initialPayload[input.name] = '';
                }
            });
        }

        setFormData({
            ...formData,
            templateName: templateValue,
            payload: initialPayload
        });
    };

    const handlePayloadChange = (fieldName, value, fieldType) => {
        let processedValue = value;

        switch (fieldType) {
            case 'number':
                processedValue = Number(value);
                break;
            case 'boolean':
                processedValue = value === true || value === 'true';
                break;
            case 'date':
            case 'time':
                processedValue = value;
                break;
            default:
                processedValue = value;
        }

        setFormData({
            ...formData,
            payload: {
                ...formData.payload,
                [fieldName]: processedValue
            }
        });
    };

    const handleSubmit = async () => {
        if (!formData.templateName || !formData.scheduledDate) {
            alert('Please fill in all required fields');
            return;
        }

        // Check if all required fields are filled
        if (selectedTemplate) {
            const missingRequired = selectedTemplate.inputs
                .filter(input => input.required)
                .find(input => {
                    const value = formData.payload[input.name];
                    return value === '' || value === null || value === undefined;
                });

            if (missingRequired) {
                alert(`Please fill in the required field: ${missingRequired.label}`);
                return;
            }
        }

        const localDate = new Date(formData.scheduledDate);
        const isoWithTZ = localDate.toISOString();

        const messageData = {
            templateName: formData.templateName,
            scheduledDate: isoWithTZ,
            targetAudience: formData.targetAudience,
            payload: formData.payload,
            updatedAt: new Date().toISOString()
        };

        try {
            if (editingMessage) {
                // Update an existing message
                const res = await editScheduledMessage(editingMessage.id, messageData);
                setMessages(messages.map(msg =>
                    msg.id === editingMessage.id
                        ? { ...msg, ...res.message }
                        : msg
                ));
                toast.success('Message updated successfully');
            } else {
                // Add a new message    
                const res = await createScheduledMessage(messageData);
                if (res.sucess) {
                    setMessages([...messages, res.message]);
                    toast.success('Message created successfully');
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'An error occurred');
        }

        setShowForm(false);
        setFormData({ templateName: '', scheduledDate: '', targetAudience: '', payload: {} });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderPayloadInput = (input) => {
        const value = formData.payload[input.name] || '';

        switch (input.type) {
            case 'boolean':
                return (
                    <select
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={value.toString()}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value === 'true', input.type)}
                    >
                        <option value="false">False</option>
                        <option value="true">True</option>
                    </select>
                );
            case 'number':
                return (
                    <input
                        type="number"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'time':
                return (
                    <input
                        type="time"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'email':
                return (
                    <input
                        type="email"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'select':
                if (input.name === 'classId') {
                    return (
                        <select
                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                            value={value}
                            onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                            required={input.required}
                        >
                            <option value="">Select a class</option>
                            {classes.length > 0 ? (
                                classes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.title}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Loading classes...</option>
                            )}
                        </select>
                    );
                }
                // Fallback for other select types
                return (
                    <select
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    >
                        <option value="">Please select</option>
                    </select>
                );
            default:
                return (
                    <input
                        type="text"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[50vh] z-[9999] flex justify-center items-center mt-10">
                <CircularProgress className='animate-spin' />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white rounded-xl shadow-lg !p-6 !mb-6">
            <div className="max-w-full mx-auto">
                <div className="">
                    <h1 className="bg-white rounded-xl shadow-lg !p-6 !mb-6 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Scheduled Messages Manager</h1>

                    {/* Search and Add Button */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by template name or payload content..."
                                className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            + Add New Message
                        </button>
                    </div>

                    {/* Messages List */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-green-100">
                                    <th className="text-left p-4 border-b-2 border-green-200 font-semibold text-green-800">ID</th>
                                    <th className="text-left p-4 border-b-2 border-green-200 font-semibold text-green-800">Template Name</th>
                                    <th className="text-left p-4 border-b-2 border-green-200 font-semibold text-green-800">Scheduled Date</th>
                                    <th className="text-left p-4 border-b-2 border-green-200 font-semibold text-green-800">Target Audience</th>
                                    <th className="text-left p-4 border-b-2 border-green-200 font-semibold text-green-800">Payload</th>
                                    <th className="text-left p-4 border-b-2 border-green-200 font-semibold text-green-800">Status</th>
                                    <th className="text-left p-4 border-b-2 border-green-200 font-semibold text-green-800">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.map((message) => (
                                    <tr key={message.id} className="hover:bg-green-50 transition-colors">
                                        <td className="p-4 border-b border-green-100">{message.id}</td>
                                        <td className="p-4 border-b border-green-100 font-medium">{message.templateName}</td>
                                        <td className="p-4 border-b border-green-100">{formatDate(message.scheduledDate)}</td>
                                        <td className="p-4 border-b border-green-100">{message.targetAudience || 'N/A'}</td>
                                        <td className="p-4 border-b border-green-100">
                                            <pre className="text-sm bg-gray-100 p-2 rounded max-w-xs overflow-x-auto">
                                                {JSON.stringify(message.payload, null, 2)}
                                            </pre>
                                        </td>
                                        <td className="p-4 border-b border-green-100">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${message.sent
                                                ? 'bg-green-200 text-green-800'
                                                : 'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                {message.sent ? 'Sent' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-green-100">
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={message.sent}
                                                    onClick={() => handleEdit(message)}
                                                    className={`px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors ${message.sent && 'opacity-50 cursor-not-allowed'}`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(message.id)}
                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredMessages.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? 'No messages found matching your search.' : 'No scheduled messages found.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-green-800 mb-6">
                                    {editingMessage ? 'Edit Scheduled Message' : 'Add New Scheduled Message'}
                                </h2>

                                <div>
                                    <div className="mb-4">
                                        <label className="block text-green-700 font-semibold mb-2">Template Name</label>
                                        <select
                                            className="px-3 w-full py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                                            value={formData.templateName}
                                            onChange={(e) => handleTemplateChange(e.target.value)}
                                        >
                                            <option value="">Please Select Template</option>
                                            {templateName.map((template, index) => (
                                                <option key={index} value={template.name}>{template.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='mb-6'>
                                        <label className='block text-green-700 font-semibold mb-2'>Target Audience</label>
                                        <select
                                            className="px-3 w-full py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                                            value={formData.targetAudience}
                                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                        >
                                            <option value="">Please Select Target Audience</option>
                                            <option value="ALL">All</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="Active-Subscribers">Active Subscribers</option>
                                            <option value="Inactive-Subscribers">Inactive Subscribers</option>
                                            <option value="Active-Free-Trial">Active Free Trial User</option>
                                            <option value="Inactive-Free-Trial">Inactive Free Trial User</option>

                                        </select>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-green-700 font-semibold mb-2">Scheduled Date</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            step="600"
                                            className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                                            value={formData.scheduledDate}
                                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                        />
                                    </div>

                                    {/* Dynamic Payload Fields Based on Selected Template */}
                                    {selectedTemplate && selectedTemplate.inputs.length > 0 && (
                                        <div className="mb-6">
                                            <label className="block text-green-700 font-semibold mb-4">Payload Fields</label>
                                            <div className="space-y-4">
                                                {selectedTemplate.inputs.map((input, index) => (
                                                    <div key={index} className="flex flex-col">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {input.label}
                                                            {input.required && <span className="text-red-500 ml-1">*</span>}
                                                            <span className="text-gray-500 ml-2">({input.type})</span>
                                                        </label>
                                                        {renderPayloadInput(input)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {!selectedTemplate && formData.templateName && (
                                        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                                            <p className="text-yellow-800">Template configuration not found for: {formData.templateName}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                        >
                                            {editingMessage ? 'Update' : 'Create'} Message
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
}