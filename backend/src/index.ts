import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv, { parse } from "dotenv";
import bcrypt from 'bcrypt';
import { ContentModel, TagModel, UserModel } from "./db";
import { signupSchema } from "./validators/uservalidation";
import { contentSchema } from "./validators/contentvalidation";
import { UserAuth } from "./middleware";
import { getPreviewHTML } from "./utils/scraper";
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI!);

app.post("/api/v1/signup", async function(req, res){
    const { email, password, name } = signupSchema.parse(req.body);
    const response = await UserModel.findOne({
        email: email
    });

    if(response){
        return res.status(403).json({
            message: "Email already exists !"
        });
    }

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
    });

    return res.status(200).json({
        message: "Signed Up Successfully"
    });
});

app.post("/api/v1/signin", async function(req, res){
    const { email, password } = req.body;
    const response = await UserModel.findOne({
        email: email
    });

    if(!response){
        return res.status(403).json({
            message: "Wrong Email or Password"
        });
    }

    const matchedPassword = await bcrypt.compare(password, response.password);
    if(response && matchedPassword){
        const token = jwt.sign({
            id: response._id.toString()
        }, process.env.JWT_SECRET!);

        res.status(200).json({
            token: token
        });
    } else {
        return res.status(403).json({
            message: "Wrong Email or Password !"
        });
    }
});

app.post("/api/v1/content", UserAuth, async function(req, res) {
    const { title, type, link, tags } : {
        title: string;
        type: string;
        link: string;
        tags?: string[];
    } = contentSchema.parse(req.body);

    let previewhtml = "";
    try {
        previewhtml = await getPreviewHTML(link);
    } catch (error) {
        console.error("Preview fetch failed", error);
    }

    const content = await ContentModel.create({
        title: title,
        type: type,
        link: link,
        tags: [],
        creatorId: req.userId,
        previewhtml: previewhtml
    });

    const tagIds = [];
    if(!tags) {
        return;
    }
    for(let tagtitle of tags) {
        let tag = await TagModel.findOne({ 
            title: tagtitle 
        });
        if(!tag){
            tag = await TagModel.create({
                title: tagtitle,
                contentId: content._id
            });
        } else {
            await TagModel.updateOne({
                title: tagtitle
            }, {
                $addToSet: { contentId: content._id }
            });
            tag = await TagModel.findOne({ title: tagtitle });
        }
        if(tag) tagIds.push(tag._id);
    }

    content.tags = tagIds;
    await content.save();

    res.status(200).json({
        message: "Content added...",
        contentId: content._id,
        previewhtml
    });
});

app.get("/api/v1/content", UserAuth, async function(req, res) {
    const creatorId = req.userId;
    const contents = await ContentModel.find({
        creatorId: creatorId
    }).populate([
        {
            path: 'creatorId',
            select: 'name email -_id'
        },
        {
            path: 'tags',
            select: 'title -_id'
        }
    ]);

    if(!contents){
        return res.status(404).json({
            message: "Cannot find the contents"
        });
    }
    res.status(200).json({
        contents
    });
});




app.listen(process.env.PORT!, () => {
    console.log(`Server running at port ${process.env.PORT}`);
});