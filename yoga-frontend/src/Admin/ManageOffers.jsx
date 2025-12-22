import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createOffer, deleteOffer, getAllOffers, updateOffer } from '../services/api';

const ManageOffers = () => {
    const [offers, setOffers] = useState([]);
    const [offer, setOffer] = useState({
        text: '',
        startDate: '',
        endDate: '',
        isActive: true,
    });
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const API_URL = 'http://localhost:8000/api/offers';

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await getAllOffers();
            setOffers(response.data.offers);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const handleChange = (e) => {
        setOffer({ ...offer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            try {
                await updateOffer(editingId, offer);
                // await axios.put(`${API_URL}/${editingId}`, offer, {
                //     headers: {
                //         Authorization: `Bearer ${localStorage.getItem('token')}`,
                //     },
                // });
                setEditing(false);
                setEditingId(null);
            } catch (error) {
                console.error('Error updating offer:', error);
            }
        } else {
            try {
                await createOffer(offer);
                await axios.post(API_URL, offer, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            } catch (error) {
                console.error('Error creating offer:', error);
            }
        }
        fetchOffers();
        setOffer({ text: '', startDate: '', endDate: '', isActive: true });
    };

    const handleEdit = (offer) => {
        setEditing(true);
        setEditingId(offer.id);
        setOffer({
            text: offer.text,
            startDate: new Date(offer.startDate).toISOString().split('T')[0],
            endDate: new Date(offer.endDate).toISOString().split('T')[0],
            isActive: offer.isActive,
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteOffer(id);
            // await axios.delete(`${API_URL}/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${localStorage.getItem('token')}`,
            //     },
            // });
            fetchOffers();
        } catch (error) {
            console.error('Error deleting offer:', error);
        }
    };

    return (
        <div>
            <h2>Manage Offers</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="text"
                    value={offer.text}
                    onChange={handleChange}
                    placeholder="Offer Text"
                    required
                />
                <input
                    type="date"
                    name="startDate"
                    value={offer.startDate}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="endDate"
                    value={offer.endDate}
                    onChange={handleChange}
                    required
                />
                <label>
                    Is Active:
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={offer.isActive}
                        onChange={(e) => setOffer({ ...offer, isActive: e.target.checked })}
                    />
                </label>
                <button type="submit">{editing ? 'Update Offer' : 'Create Offer'}</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Text</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {offers.map((o) => (
                        <tr key={o.id}>
                            <td>{o.text}</td>
                            <td>{new Date(o.startDate).toLocaleDateString()}</td>
                            <td>{new Date(o.endDate).toLocaleDateString()}</td>
                            <td>{o.isActive ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleEdit(o)}>Edit</button>
                                <button onClick={() => handleDelete(o.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOffers;
