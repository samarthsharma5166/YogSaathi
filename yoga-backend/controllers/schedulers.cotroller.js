import { prisma } from "../db/db.js"

export const getScheduledMessages = async (req, res) => {
    try {
        const messages = await prisma.scheduledMessage.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        if (!res) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        console.log("error")
        res.status(500).json({ message: "something went wrong" });
    }
}

export const createScheduledMessage = async (req, res) => {
    try {
        const { templateName, scheduledDate, targetAudience, payload } = req.body

        if (!templateName || !scheduledDate || !targetAudience || !payload) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const formatedDate = new Date(scheduledDate);

        // If targetAudience is an array (e.g. multiple groups selected)
        if (Array.isArray(targetAudience) && targetAudience.length > 0) {
            const createdMessages = [];
            for (const aud of targetAudience) {
                const message = await prisma.scheduledMessage.create({
                    data: {
                        templateName,
                        scheduledDate: formatedDate,
                        targetAudience: aud,
                        payload: payload
                    }
                });
                createdMessages.push(message);
            }
            return res.status(200).json({
                sucess: true,
                success: true,
                message: createdMessages[0],
                messages: createdMessages
            });
        }

        const message = await prisma.scheduledMessage.create({
            data: {
                templateName,
                scheduledDate: formatedDate,
                targetAudience: Array.isArray(targetAudience) ? targetAudience[0] : targetAudience,
                payload: (payload)
            }
        })

        return res.status(200).json({ sucess: true, success: true, message, messages: [message] });
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "something went wrong" });
    }
}

export const editScheduledMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { templateName, scheduledDate, targetAudience, payload } = req.body

        if (!templateName || !scheduledDate || !targetAudience || !payload) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const formatedDate = new Date(scheduledDate);
        const audienceString = Array.isArray(targetAudience) ? targetAudience[0] : targetAudience;

        const message = await prisma.scheduledMessage.update({
            where: { id: Number(id) },
            data: {
                templateName,
                scheduledDate: formatedDate,
                targetAudience: audienceString,
                payload: (payload)
            }
        })

        return res.status(200).json({ sucess: true, success: true, message });
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "something went wrong" });
    }
}

export const deletecheduledMessage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ error: "id not found" });
        }
        const message = await prisma.scheduledMessage.delete({
            where: { id: Number(id) },
        })
        return res.status(200).json({ success: true, message: "message deleted successfully", id: message.id });
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "something went wrong" });
    }
}