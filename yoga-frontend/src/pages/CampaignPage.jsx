import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { use } from "react";
import { useCallback } from "react";
import { createCampaign, fetchCampaignsFromDb, updateCampaign, updateStatus } from "../services/api";

const API_URL = "http://localhost:5000/api/campaigns";

export default function CampaignPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        isActive: true,
    });
    const [editingId, setEditingId] = useState(null);

    const handleCloseModal = useCallback(() => {
        setAddModalOpen(false);
        setForm({
            startDate: "",
            endDate: "",
            isActive: true,
        });
        setEditingId(null);
    }, [addModalOpen, form, editingId]);

    // ✅ Fetch campaigns
    const fetchCampaigns = async () => {
        try {
            const { data } = await fetchCampaignsFromDb();
            setCampaigns(data.data);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // ✅ Handle form input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ✅ Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await updateCampaign(editingId, form);
                if (res.data.success){
                    setAddModalOpen(false);
                }
            } else {
                const res = await createCampaign(form);
                if(res.data.success){
                    setAddModalOpen(false);
                }
            }
            setForm({ startDate: "", endDate: "", isActive: true });
            setEditingId(null);
            fetchCampaigns();
        } catch (error) {
            console.error("Error saving campaign:", error);
        }
    };

    // ✅ Edit campaign
    const handleEdit = (campaign) => {
        setForm({
            startDate: campaign.startDate.split("T")[0],
            endDate: campaign.endDate.split("T")[0],
            isActive: campaign.isActive,
        });
        setEditingId(campaign.id);
        setAddModalOpen(true);
    };

    // ✅ Delete campaign
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchCampaigns();
        } catch (error) {
            console.error("Error deleting campaign:", error);
        }
    };

    const handleStatusUpdate = async(e,id) =>{
        if (e.target.name === "deactivate"){
            const res = await updateStatus(id,{isActive:false})
            if(res.data.success){
                setCampaigns(prev =>
                    prev.map(campaign =>
                        campaign.id === res.data.data.id ? res.data.data : campaign
                    )
                );
            }
        }

        if (e.target.name === "activate") {
            const res = await updateStatus(id, { isActive: true });
            if (res.data.success) {
                setCampaigns(prev =>
                    prev.map(campaign =>
                        campaign.id === res.data.data.id ? res.data.data : campaign
                    )
                );
            }
        }
    }

    return (
        <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
            {addModalOpen && <AddCampaign handleCloseModal={handleCloseModal} handleChange={handleChange} handleSubmit={handleSubmit} form={form}/>}
             <button onClick={() => setAddModalOpen(true)} className="bg-green-500 text-white !px-4 !py-2 !mr-2 rounded-md fixed bottom-4 right-4 ">
                <Plus/>
             </button>
            <h1 className="bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Campaigns</h1>

            <div className=" bg-white rounded-xl shadow-md border border-gray-200 p-4 mt-4 min-h-full ">
                {
                    campaigns.length > 0 ? (
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Id</th>
                                    <th scope="col" className="px-6 py-4">Start Date</th>
                                    <th scope="col" className="px-6 py-4">End Date</th>
                                    <th scope="col" className="px-6 py-4">Active</th>
                                    <th scope="col" className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="border-b dark:border-neutral-500">
                                        <td className="p-2">{campaign.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{campaign.startDate.split("T")[0]}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{campaign.endDate.split("T")[0]}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{campaign.isActive ? "Yes" : "No"}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <button onClick={() => handleEdit(campaign)} className="bg-green-500 text-white !px-4 !py-2 !mr-2 rounded-md">Edit</button>
                                            <button onClick={() => handleDelete(campaign.id)} className="bg-red-500 text-white !px-4 !py-2 !mr-2 rounded-md">Delete</button>
                                            {campaign.isActive ?
                                            <button onClick={(e)=>handleStatusUpdate(e,campaign.id)} name="deactivate" className="bg-red-500 text-white !px-4 !py-2 !mr-2 rounded-md">Deactivate</button> :
                                                <button onClick={(e) => handleStatusUpdate(e, campaign.id)} name="activate" className="bg-blue-500 text-white !px-4 !py-2 !mr-2 rounded-md">Acitvate</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>    
                    ) : (
                        <p className="text-center">No campaigns found</p>
                    )
                }
            </div>
        </div>
    );
}

function AddCampaign({ handleCloseModal, handleChange, handleSubmit, form }) {
        return(
            <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/60 flex justify-center items-center ">
                <div className=" bg-white min-w-md rounded-xl shadow-md border border-gray-200 p-4 font">
                    <h1 className="text-2xl bg-white rounded-xl mb-4 shadow-md border border-gray-200 p-4 px-10 font">Add Campaign</h1>
                    <form onSubmit={(e) => handleSubmit(e)} action="">
                        <div className="flex flex-col">
                            <label htmlFor="">Start Date</label>
                            <input value={form.startDate} onChange={(e) => handleChange(e)}  className="p-2 border border-gray-700 rounded-lg" type="date" name="startDate" id="startDate" />
                            <p className="text-gray-600 text-xs px-2 py-1 tracking-wide">choose a start date</p>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="">End Date</label>
                            <input value={form.endDate} onChange={(e) => handleChange(e)} className="p-2 border border-gray-700 rounded-lg" type="date" name="endDate" id="endDate" />
                            <p className="text-gray-600 text-xs px-2 py-1 tracking-wide">choose a end date</p>
                        </div>
                        <div className="flex justify-end">
                            <button onSubmit={(e)=>handleSubmit(e)} type="submit" className="bg-green-500 text-white !px-4 !py-2 !mr-2 rounded-md">Submit</button>
                            <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-gray-600 !px-4 !py-2 rounded-md">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
