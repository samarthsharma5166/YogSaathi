import { prisma } from "../db/db.js";

export async function createBlogCtrl(req, res) {
    try {

        if(!req.file){
            return res.status(400).json({ error: "No file uploaded" });
        }


        const blogs = await prisma.blog.create({
            data:{
                title: req.body.title,
                content: req.body.content,
                authorId: req.user.id,
                img: req.file.path
            }
        });

        if (!blogs) return res.status(404).json({ error: "Blog not found" });
        
        res.json({
            success: true,
            blogs
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
}

export async function getAllBlogsCtrl(req, res) {
    try {
        const blogs = await prisma.blog.findMany();
        if (!blogs) return res.status(404).json({ error: "Blog not found" });
        res.json({
            success:true,
            blogs
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
}

export async function  getBlogByIdCtrl(req, res) {
    const id = req.params.id;
    try {
        const blog = await prisma.blog.findFirst({
            where: { id: id }
        });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json({
            success: true,
            blog
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
}

export async function updateBlogCtrl(req, res) {
    const { id } = req.params;
    try {
        const blog = await prisma.blog.findFirst({
            where: { id: id }
        })
        const updateblog = await prisma.blog.update({
            where: { id: id },
            data:{
                title: req.body.title || blog.title,
                content: req.body.content || blog.content,
                authorId: req.user.id,
                img: req.file?.path|| blog.img
            }
        });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json({
            success: true,
            blog
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
}

export async function deleteBlogCtrl(req, res) {
   const { id } = req.params;
    try {
        const blog = await prisma.blog.delete({
            where: { id: id }
        })
        return res.status(200).json({ success: true, message: "Blog deleted successfully", blog });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
}