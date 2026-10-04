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
            // { label: "Session Link", name: "sessionLink", type: "text", required: true },
        ]
    },
    {
        name: "giftwellness_yogsaathi",
        inputs: []
    },
    {
        name: "weekly_attendance_status__yogsaathi_sessions",
        inputs: []
    },
    {
        name: "yoga_subscription_offer",
        inputs: []
    },
    {
        name: "subscription_invitation",
        inputs: []
    },
    {
        name: "share_wellness_14_days_of_free_yoga",
        inputs: []
    },
    {
        name: "vijayadashami_greetings",
        inputs: []
    },
    {
        name: "vijaydashmi_greetings_and_referrals",
        inputs: []
    },
    {
        name: "yoga_trial_midway_update__reminder",
        inputs: []
    },
    {
        name: "yogsaathi_contact_detail",
        inputs: []
    },
    {
        name: "festival_greetings",
        inputs: []
    },
    {
        name: "yoga_offer_reminder",
        inputs: []
    },
    {
        name: "yogsaathi_communication_channels",
        inputs: []
    },
    {
        name: "free_online_yoga_trial_reminder",
        inputs: []
    },
    {
        name: "yoga_class_time_details_as_per_ist",
        inputs: []

    },
    {
        name: "yoga_trial_participation_reminder",
        inputs: [
            { label: "Link", name: "Link", type: "text", required: true },
        ]
    },
    {
        name: "21_days_yoga_trial_intimation_hindi",
        inputs: []
    },
    {
        name: "world_meditation_day_greetings",
        inputs: []
    },
    {
        name: "festival_greetings_christmas_new_year",
        inputs: []
    },
    {
        name: "online_free_yoga_trial__joining_details",
        inputs: []
    },
    {
        name: "class_reminder_free_yoga_for_all",
        inputs: [
            { label: "Class Name", name: "classId", type: "select", required: true },
        ]
    },
    {
        name: "subscription_plan_new_year_offer",
        inputs: []
    },
    {
        name: "yoga_training_1ram",
        inputs: []
    },
    {
        name: "yoga_training_2",
        inputs: []
    },
    {
        name: "yoga_trail_intimation_",
        inputs: []
    },
    {
        name: "yogsaathi_payment_link_share",
        inputs: []
    }, {
        name: "yogsaathi_training_brochure_share",
        inputs: []
    },
    {
        name: "yoga_trial_enrolment",
        inputs: []
    },
    {
        name: "opi",
        inputs: []
    },
    {
        name: "yogsaathi_group_access_update",
        inputs: []
    },
    {
        name: "inputs",
        inputs: []
    },
    {
        name: "retreat_info_brochure",
        inputs: []
    },
    {
        name: "trial_expiry_notification",
        inputs: []
    },
    {
        name: "session_schedule_notification",
        inputs: [
            { label: "Title", name: "title", type: "text", required: true },
            { label: "Speaker", name: "speaker", type: "text", required: true },
            { label: "Date & Time", name: "date", type: "text", required: true },
            { label: "Link", name: "link", type: "text", required: true },
        ]
    },
    {
        name: "orientation_program__new",
        inputs: [
            { label: "Date & Time", name: "date", type: "date", required: true },
            { label: "Time", name: "time", type: "text", required: true },
            // {label:"Link", name:"link", type:"text", required: true},
        ]
    },
    {
        name: "regularity_key_hindi",
        inputs: []
    },
    {
        name: "session_particulars",
        inputs: [
            { label: "Date", name: "date", type: "date", required: true },
            { label: "Time", name: "time", type: "text", required: true },
            { label: "Link", name: "link", type: "text", required: true },
            { label: "Topic", name: "topic", type: "text", required: true },
            { label: "Duration Start", name: "durationstart", type: "text", required: true },
            { label: "Duration End", name: "durationend", type: "text", required: true },
        ]
    },
    {
        name: "subscription_offer_",
        inputs: []
    },
    {
        name: "template_session_20260627022218",
        inputs: [
            { label: "Topic", name: "topic", type: "text", required: true },
            { label: "Date", name: "date", type: "date", required: true },
            { label: "Time", name: "time", type: "text", required: true },
            { label: "Duration Start", name: "duration", type: "text", required: true },
            { label: "Instructor", name: "instructor", type: "text", required: true },
            { label: "Link", name: "link", type: "text", required: true },
        ]
    },
    {
        name: "session_info",
        inputs: [
            { label: "Topic", name: "topic", type: "text", required: true },
            { label: "Date", name: "date", type: "date", required: true },
            { label: "Time", name: "time", type: "text", required: true },
            { label: "Duration Start", name: "duration", type: "text", required: true },
            { label: "Instructor", name: "instructor", type: "text", required: true },
            { label: "Link", name: "link", type: "text", required: true },
        ]
    },
    {
        name: "confirmation_regn",
        inputs: [
            { label: "Date", name: "date", type: "date", required: true },
            { label: "Time", name: "time", type: "text", required: true },
            { label: "Link", name: "link", type: "text", required: true },
        ]
    },
    {
        name: "onetoone_yoga_support",
        inputs: []
    },
    {
        name: "yoga_session_info_f",
        inputs: []
    },
    {
        name: "yogsaathi_class_attendance_reminder",
        inputs: []
    }, {
        name: "ignore_template",
        inputs: []
    }
];

const TARGET_AUDIENCE_OPTIONS = [
    { value: "Active-Free-Trial", label: "Active Free Trial User", group: "Free Trial", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    { value: "Inactive-Free-Trial", label: "Inactive Free Trial User", group: "Free Trial", badgeColor: "bg-teal-100 text-teal-800 border-teal-300" },
    { value: "Active-Subscribers", label: "Active Subscribers", group: "Subscribers", badgeColor: "bg-blue-100 text-blue-800 border-blue-300" },
    { value: "Inactive-Subscribers", label: "Inactive Subscribers", group: "Subscribers", badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300" },
    { value: "Active-Trial-And-Subscribers", label: "Active Free Trial & Active Subscribers", group: "Combined", badgeColor: "bg-purple-100 text-purple-800 border-purple-300" },
    { value: "Free-Trial-And-Dietician-Registrants", label: "Free Trial & Dietician Registrants", group: "Combined", badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300" },
    { value: "Dietician-Registrants", label: "Dietician Session Registrants", group: "Registrations", badgeColor: "bg-violet-100 text-violet-800 border-violet-300" },
    { value: "Yoga-Session-Registrants", label: "Yoga Session Registrants", group: "Registrations", badgeColor: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300" },
    { value: "Leads", label: "Yoga Leads", group: "Leads", badgeColor: "bg-amber-100 text-amber-800 border-amber-300" },
    { value: "Dietician-Leads", label: "Dietician Session Leads", group: "Leads", badgeColor: "bg-orange-100 text-orange-800 border-orange-300" },
    { value: "ALL", label: "All Users", group: "General", badgeColor: "bg-gray-100 text-gray-800 border-gray-300" },
    { value: "ADMIN", label: "Admin", group: "General", badgeColor: "bg-rose-100 text-rose-800 border-rose-300" },
];

export default function ScheduledMessageManager() {
    const [messages, setMessages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [audienceFilter, setAudienceFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        templateName: '',
        scheduledDate: '',
        selectedAudiences: [],
        filterStartDate: '',
        filterEndDate: '',
        payload: {}
    });

    async function getScheduledMessages() {
        try {
            const res = await getAllScheduledMessages();
            setMessages(res.messages || []);
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch scheduled messages');
        }
    }

    async function getClasses() {
        try {
            const res = await getClassesfromDb();
            setClasses(res.data?.data || []);
        } catch (error) {
            toast.error('Failed to fetch classes');
            console.error(error);
        }
    }

    useEffect(() => {
        if (formData.templateName === 'class_reminder' || formData.templateName === 'class_reminder_free_yoga_for_all') {
            getClasses();
        }
    }, [formData.templateName]);

    useEffect(() => {
        setLoading(true);
        getScheduledMessages().finally(() => setLoading(false));
    }, []);

    // Get the selected template configuration
    const selectedTemplate = useMemo(() => {
        return templateName.find(template => template.name === formData.templateName);
    }, [formData.templateName]);

    const filteredMessages = useMemo(() => {
        return messages.filter(message => {
            const matchesSearch =
                message.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (message.targetAudience && message.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())) ||
                JSON.stringify(message.payload || {}).toLowerCase().includes(searchTerm.toLowerCase());

            const matchesAudience = audienceFilter === 'ALL' || message.targetAudience === audienceFilter;
            const matchesStatus =
                statusFilter === 'ALL' ||
                (statusFilter === 'SENT' && message.sent) ||
                (statusFilter === 'PENDING' && !message.sent);

            return matchesSearch && matchesAudience && matchesStatus;
        });
    }, [messages, searchTerm, audienceFilter, statusFilter]);

    const handleAddNew = () => {
        setEditingMessage(null);
        setFormData({
            templateName: '',
            scheduledDate: '',
            selectedAudiences: [],
            filterStartDate: '',
            filterEndDate: '',
            payload: {}
        });
        setShowForm(true);
    };

    const toISTDateTimeLocal = (utcDate) => {
        if (!utcDate) return '';
        const date = new Date(utcDate);
        // Shift to IST (+5:30)
        const offsetMs = 5.5 * 60 * 60 * 1000;
        const ist = new Date(date.getTime() + offsetMs);
        return ist.toISOString().slice(0, 16);
    };

    const handleEdit = (message) => {
        setEditingMessage(message);
        const payload = message.payload || {};
        const filterStartDate = payload.filterStartDate || payload.startDateFilter || '';
        const filterEndDate = payload.filterEndDate || payload.endDateFilter || '';

        const cleanPayload = { ...payload };
        delete cleanPayload.filterStartDate;
        delete cleanPayload.filterEndDate;
        delete cleanPayload.startDateFilter;
        delete cleanPayload.endDateFilter;

        setFormData({
            templateName: message.templateName,
            scheduledDate: toISTDateTimeLocal(message.scheduledDate),
            selectedAudiences: message.targetAudience ? [message.targetAudience] : [],
            filterStartDate: filterStartDate ? String(filterStartDate).slice(0, 10) : '',
            filterEndDate: filterEndDate ? String(filterEndDate).slice(0, 10) : '',
            payload: cleanPayload
        });

        if (message.templateName === 'class_reminder' || message.templateName === 'class_reminder_free_yoga_for_all') {
            getClasses();
        }

        setShowForm(true);
    };

    const handleDuplicate = (message) => {
        setEditingMessage(null); // Creating fresh schedule
        const payload = message.payload || {};
        const filterStartDate = payload.filterStartDate || payload.startDateFilter || '';
        const filterEndDate = payload.filterEndDate || payload.endDateFilter || '';

        const cleanPayload = { ...payload };
        delete cleanPayload.filterStartDate;
        delete cleanPayload.filterEndDate;
        delete cleanPayload.startDateFilter;
        delete cleanPayload.endDateFilter;

        setFormData({
            templateName: message.templateName,
            scheduledDate: '',
            selectedAudiences: message.targetAudience ? [message.targetAudience] : [],
            filterStartDate: filterStartDate ? String(filterStartDate).slice(0, 10) : '',
            filterEndDate: filterEndDate ? String(filterEndDate).slice(0, 10) : '',
            payload: cleanPayload
        });

        if (message.templateName === 'class_reminder' || message.templateName === 'class_reminder_free_yoga_for_all') {
            getClasses();
        }

        setShowForm(true);
        toast.success('Template pre-filled! Pick a new date/time or target groups to schedule again.');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scheduled message?')) {
            const res = await deleteScheduledMessage(id);
            if (res.success) {
                setMessages(messages.filter(message => message.id !== res.id));
                toast.success('Message deleted successfully');
            }
        }
    };

    const handleTemplateChange = (templateValue) => {
        const template = templateName.find(t => t.name === templateValue);
        const initialPayload = {};

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

    const toggleAudience = (audValue) => {
        if (editingMessage) {
            // When editing an existing single schedule, only 1 audience is selected
            setFormData(prev => ({
                ...prev,
                selectedAudiences: [audValue]
            }));
            return;
        }

        setFormData(prev => {
            const exists = prev.selectedAudiences.includes(audValue);
            const updated = exists
                ? prev.selectedAudiences.filter(a => a !== audValue)
                : [...prev.selectedAudiences, audValue];
            return { ...prev, selectedAudiences: updated };
        });
    };

    const selectAllAudiences = () => {
        setFormData(prev => ({
            ...prev,
            selectedAudiences: TARGET_AUDIENCE_OPTIONS.map(a => a.value)
        }));
    };

    const clearAllAudiences = () => {
        setFormData(prev => ({
            ...prev,
            selectedAudiences: []
        }));
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
            toast.error('Please fill in Template Name and Scheduled Date');
            return;
        }

        if (formData.selectedAudiences.length === 0) {
            toast.error('Please select at least one Target Audience / User Group');
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
                toast.error(`Please fill in required field: ${missingRequired.label}`);
                return;
            }
        }

        const localDate = new Date(formData.scheduledDate);
        const isoWithTZ = localDate.toISOString();

        const finalPayload = {
            ...formData.payload
        };

        if (formData.filterStartDate) {
            finalPayload.filterStartDate = formData.filterStartDate;
        }
        if (formData.filterEndDate) {
            finalPayload.filterEndDate = formData.filterEndDate;
        }

        try {
            if (editingMessage) {
                // Update an existing message
                const messageData = {
                    templateName: formData.templateName,
                    scheduledDate: isoWithTZ,
                    targetAudience: formData.selectedAudiences[0] || editingMessage.targetAudience,
                    payload: finalPayload,
                    updatedAt: new Date().toISOString()
                };

                const res = await editScheduledMessage(editingMessage.id, messageData);
                if (res.sucess || res.success) {
                    setMessages(messages.map(msg =>
                        msg.id === editingMessage.id
                            ? { ...msg, ...(res.message || messageData) }
                            : msg
                    ));
                    toast.success('Scheduled message updated successfully');
                }
            } else {
                // Add new message(s) - supports scheduling same template to multiple groups at once!
                const messageData = {
                    templateName: formData.templateName,
                    scheduledDate: isoWithTZ,
                    targetAudience: formData.selectedAudiences.length === 1 ? formData.selectedAudiences[0] : formData.selectedAudiences,
                    payload: finalPayload
                };

                const res = await createScheduledMessage(messageData);
                if (res.sucess || res.success) {
                    if (res.messages && res.messages.length > 0) {
                        setMessages(prev => [...res.messages, ...prev]);
                        toast.success(`Successfully scheduled ${res.messages.length} message(s)!`);
                    } else if (res.message) {
                        setMessages(prev => [res.message, ...prev]);
                        toast.success('Scheduled message created successfully!');
                    } else {
                        getScheduledMessages();
                        toast.success('Scheduled message created successfully!');
                    }
                }
            }

            setShowForm(false);
            setFormData({
                templateName: '',
                scheduledDate: '',
                selectedAudiences: [],
                filterStartDate: '',
                filterEndDate: '',
                payload: {}
            });
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'An error occurred while saving');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return dateString;
            return d.toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "short",
                day: "2-digit"
            });
        } catch {
            return dateString;
        }
    };

    const renderPayloadInput = (input) => {
        const value = formData.payload[input.name] !== undefined ? formData.payload[input.name] : '';

        switch (input.type) {
            case 'boolean':
                return (
                    <select
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
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
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'time':
                return (
                    <input
                        type="time"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'email':
                return (
                    <input
                        type="email"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
                        value={value}
                        onChange={(e) => handlePayloadChange(input.name, e.target.value, input.type)}
                    />
                );
            case 'select':
                if (input.name === 'classId') {
                    return (
                        <select
                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
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
                return (
                    <select
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
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
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800"
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
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 mb-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Top Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                            Scheduled Messages Manager
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Schedule templates across multiple user groups with custom registration/subscription date filters.
                        </p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Schedule Message
                    </button>
                </div>

                {/* Filters & Search Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div className="md:col-span-2 relative">
                            <input
                                type="text"
                                placeholder="Search by template name, target group, or payload..."
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Target Audience Filter */}
                        <div>
                            <select
                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm bg-white"
                                value={audienceFilter}
                                onChange={(e) => setAudienceFilter(e.target.value)}
                            >
                                <option value="ALL">All Target Audiences</option>
                                {TARGET_AUDIENCE_OPTIONS.map((aud) => (
                                    <option key={aud.value} value={aud.value}>{aud.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Statuses ({messages.length})</option>
                                <option value="PENDING">Pending Only ({messages.filter(m => !m.sent).length})</option>
                                <option value="SENT">Sent Only ({messages.filter(m => m.sent).length})</option>
                            </select>
                        </div>
                    </div>

                    {/* Quick Stats Pills */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
                        <span className="font-semibold text-gray-700">Overview:</span>
                        <span className="px-2.5 py-1 bg-gray-100 rounded-full font-medium">Total: {messages.length}</span>
                        <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">Pending: {messages.filter(m => !m.sent).length}</span>
                        <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-medium">Sent: {messages.filter(m => m.sent).length}</span>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-auto text-red-600 hover:text-red-700 font-medium underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages List Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gradient-to-r from-green-50 to-emerald-50/60 border-b border-green-200/80 text-xs uppercase tracking-wider font-bold text-green-900">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Template Name</th>
                                    <th className="p-4">Target Group</th>
                                    <th className="p-4">User Date Filter</th>
                                    <th className="p-4">Scheduled Date (IST)</th>
                                    <th className="p-4">Payload</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredMessages.map((message) => {
                                    const audOption = TARGET_AUDIENCE_OPTIONS.find(o => o.value === message.targetAudience);
                                    const payload = message.payload || {};
                                    const filterStart = payload.filterStartDate || payload.startDateFilter;
                                    const filterEnd = payload.filterEndDate || payload.endDateFilter;
                                    const hasDateFilter = filterStart || filterEnd;

                                    // Display payload keys excluding filter dates
                                    const displayPayload = { ...payload };
                                    delete displayPayload.filterStartDate;
                                    delete displayPayload.filterEndDate;
                                    delete displayPayload.startDateFilter;
                                    delete displayPayload.endDateFilter;

                                    return (
                                        <tr key={message.id} className="hover:bg-green-50/40 transition-colors">
                                            <td className="p-4 font-mono text-xs text-gray-500">#{message.id}</td>

                                            <td className="p-4 font-semibold text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    {message.templateName}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${audOption?.badgeColor || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                                    {audOption?.label || message.targetAudience || 'ALL'}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                {hasDateFilter ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium">
                                                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>
                                                            {filterStart ? formatDateOnly(filterStart) : 'Any'} → {filterEnd ? formatDateOnly(filterEnd) : 'Present'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">
                                                        All Users (No Date Filter)
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-4 text-gray-700 whitespace-nowrap font-medium text-xs">
                                                {formatDate(message.scheduledDate)}
                                            </td>

                                            <td className="p-4 max-w-xs">
                                                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-xs font-mono max-h-20 overflow-y-auto">
                                                    {Object.keys(displayPayload).length > 0 ? (
                                                        <pre className="whitespace-pre-wrap">{JSON.stringify(displayPayload, null, 2)}</pre>
                                                    ) : (
                                                        <span className="text-gray-400 italic">No extra parameters</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${message.sent
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-amber-100 text-amber-800 animate-pulse'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${message.sent ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                                    {message.sent ? 'Sent' : 'Pending'}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* Duplicate / Schedule Again */}
                                                    <button
                                                        onClick={() => handleDuplicate(message)}
                                                        title="Duplicate / Schedule template again to another group or date"
                                                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        Duplicate
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        disabled={message.sent}
                                                        onClick={() => handleEdit(message)}
                                                        className={`px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition-colors ${message.sent ? 'opacity-40 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(message.id)}
                                                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold border border-red-200 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredMessages.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="font-semibold text-gray-700">
                                    {searchTerm ? 'No scheduled messages match your search filter.' : 'No scheduled messages found.'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Click "+ Schedule Message" above to create one.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-green-100">

                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 via-emerald-50/50 to-white flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-green-900">
                                        {editingMessage ? 'Edit Scheduled Message' : 'Schedule Message / Template'}
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {editingMessage
                                            ? `Editing message ID #${editingMessage.id}`
                                            : 'Select target group(s), optional user date range, and template parameters'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* 1. Template Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-green-900 mb-2">
                                        1. Select Message Template <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="px-4 py-2.5 w-full border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none bg-white text-gray-800 font-medium"
                                        value={formData.templateName}
                                        onChange={(e) => handleTemplateChange(e.target.value)}
                                    >
                                        <option value="">-- Please Select Template --</option>
                                        {templateName.map((template, index) => (
                                            <option key={index} value={template.name}>{template.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. Target Audience Selection (Multi-select support) */}
                                <div className="bg-slate-50/80 p-4 rounded-xl border border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                        <div>
                                            <label className="block text-sm font-bold text-green-900">
                                                2. Target Audience / User Groups <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                {editingMessage
                                                    ? 'Select target group for this message'
                                                    : 'You can select multiple groups to schedule this template for all of them at once!'}
                                            </p>
                                        </div>
                                        {!editingMessage && (
                                            <div className="flex items-center gap-2 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={selectAllAudiences}
                                                    className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded font-medium transition-colors"
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={clearAllAudiences}
                                                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition-colors"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Audiences Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {TARGET_AUDIENCE_OPTIONS.map((aud) => {
                                            const isSelected = formData.selectedAudiences.includes(aud.value);
                                            const count = previewBreakdown[aud.value] !== undefined 
                                                ? previewBreakdown[aud.value] 
                                                : (audienceCounts[aud.value] !== undefined ? audienceCounts[aud.value] : null);

                                            return (
                                                <button
                                                    key={aud.value}
                                                    type="button"
                                                    onClick={() => toggleAudience(aud.value)}
                                                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-2 ${isSelected
                                                            ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                                                            : 'border-gray-200 bg-white hover:border-green-300 text-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => { }} // Handled by button click
                                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 pointer-events-none"
                                                        />
                                                        <div>
                                                            <span className="text-xs font-bold block">{aud.label}</span>
                                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{aud.group}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <span className={`px-2 py-0.5 text-xs font-extrabold rounded-md border ${
                                                            isSelected 
                                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                                                                : 'bg-gray-100 text-gray-700 border-gray-200'
                                                        }`}>
                                                            {count !== null ? `${count}` : '—'}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Live Count Summary Banner */}
                                    <div className="mt-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                                👥
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-emerald-950">
                                                    Target Recipients Count
                                                </div>
                                                <div className="text-[11px] text-emerald-700">
                                                    {formData.selectedAudiences.length === 0 
                                                        ? 'No audience selected yet' 
                                                        : `Total for ${formData.selectedAudiences.length} selected group(s)`}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {calculatingCount ? (
                                                <span className="text-xs text-emerald-700 font-semibold animate-pulse">Calculating...</span>
                                            ) : (
                                                <div className="text-right">
                                                    <span className="text-xl font-black text-emerald-800 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                                                        {previewCount !== null 
                                                            ? previewCount 
                                                            : (formData.selectedAudiences.reduce((acc, aud) => acc + (audienceCounts[aud] || 0), 0))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. User Group Date Range Filter (Optional) */}
                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-bold text-emerald-900">
                                            3. User Group Date Filter (Optional)
                                        </label>
                                        {(formData.filterStartDate || formData.filterEndDate) && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, filterStartDate: '', filterEndDate: '' })}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                                            >
                                                Clear Date Range
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-emerald-800">
                                        Filter users by registration or trial/subscription start date (e.g. <strong>from 1 Oct till 12 Dec for Free Trial</strong> or <strong>from 5 Nov till 1 Jan for Subscribers</strong>). If left empty, message goes to all users in the selected group(s).
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                From Start Date
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:outline-none bg-white text-gray-800 text-sm"
                                                value={formData.filterStartDate}
                                                onChange={(e) => setFormData({ ...formData, filterStartDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Till End Date
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:outline-none bg-white text-gray-800 text-sm"
                                                value={formData.filterEndDate}
                                                onChange={(e) => setFormData({ ...formData, filterEndDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Scheduled Date & Time */}
                                <div>
                                    <label className="block text-sm font-bold text-green-900 mb-2">
                                        4. Message Scheduled Date & Time (IST) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        step="600"
                                        className="w-full px-4 py-2.5 border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 bg-white font-medium"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Scheduled messages are processed automatically every 10 minutes.</p>
                                </div>

                                {/* 5. Dynamic Payload Fields */}
                                {selectedTemplate && selectedTemplate.inputs.length > 0 && (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <label className="block text-sm font-bold text-green-900 mb-3">
                                            5. Template Parameters ({selectedTemplate.inputs.length})
                                        </label>
                                        <div className="space-y-4">
                                            {selectedTemplate.inputs.map((input, index) => (
                                                <div key={index} className="flex flex-col">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        {input.label}
                                                        {input.required && <span className="text-red-500 ml-1">*</span>}
                                                        <span className="text-gray-400 ml-1.5 font-normal">({input.type})</span>
                                                    </label>
                                                    {renderPayloadInput(input)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!selectedTemplate && formData.templateName && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-xl text-yellow-800 text-xs">
                                        No specific template parameters configured for <strong>{formData.templateName}</strong>. Message will be sent using default template format.
                                    </div>
                                )}

                                {/* Modal Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                                    >
                                        {editingMessage
                                            ? 'Update Message'
                                            : formData.selectedAudiences.length > 1
                                                ? `Schedule for ${formData.selectedAudiences.length} Groups`
                                                : 'Create Scheduled Message'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}