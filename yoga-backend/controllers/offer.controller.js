import { prisma } from '../db/db.js'

export const createOffer = async (req, res) => {
    try {
        const { text, startDate, endDate } = req.body;
        const offer = await prisma.offer.create({
            data: {
                text,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        });
        res.status(201).json({ message: 'Offer created successfully', offer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating offer', error: error.message });
    }
};

export const getActiveOffer = async (req, res) => {
    try {
        const offer = await prisma.offer.findFirst({
            where: {
                isActive: true,
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
        });
        res.status(200).json({ offer });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active offer', error: error.message });
    }
};

export const getAllOffers = async (req, res) => {
    try {
        const offers = await prisma.offer.findMany();
        res.status(200).json({ offers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all offers', error: error.message });
    }
};

export const updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, startDate, endDate, isActive } = req.body;
        const offer = await prisma.offer.update({
            where: { id },
            data: {
                text,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive,
            },
        });
        res.status(200).json({ message: 'Offer updated successfully', offer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating offer', error: error.message });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.offer.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting offer', error: error.message });
    }
};


