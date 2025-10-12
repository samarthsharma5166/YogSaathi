import express from "express";
import {
    createYogaClass,
    getAllYogaClasses,
    getYogaClassById,
    updateYogaClass,
    deleteYogaClass,
    getAllYogaClassesList,
    getClassLink,
} from "../controllers/yogaClass.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/list",isAuthenticated,isAdmin,getAllYogaClassesList);
router.get("/", isAuthenticated,isAdmin, getAllYogaClasses);
router.post("/", isAuthenticated, isAdmin, createYogaClass);
router.get("/:id", isAuthenticated, isAdmin, getYogaClassById);
router.put("/:id", isAuthenticated, isAdmin, updateYogaClass);
router.delete("/:id", isAuthenticated, isAdmin, deleteYogaClass);

router.get("/join/:code",getClassLink)

export default router;
