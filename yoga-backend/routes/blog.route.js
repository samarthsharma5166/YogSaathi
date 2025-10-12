import express from 'express'
import { createBlogCtrl, deleteBlogCtrl, getAllBlogsCtrl, getBlogByIdCtrl, updateBlogCtrl } from '../controllers/blog.controller.js'
import { isAdmin, isAuthenticated } from '../middleware/auth.js'
import upload from '../middleware/multer.js'
const router = express.Router()

router.post('/create',isAuthenticated, isAdmin,upload.single('img'),createBlogCtrl)
router.get('/all', getAllBlogsCtrl)
router.get('/:id', getBlogByIdCtrl)
router.put('/:id',isAuthenticated,isAdmin,upload.single('img'),updateBlogCtrl)
router.delete('/:id',isAuthenticated,isAdmin, deleteBlogCtrl)

export default router