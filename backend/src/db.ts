import mongoose from "mongoose";
import { required } from "zod/v4/core/util.cjs";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

export const UserModel = mongoose.model("User", UserSchema);

export const contentTypes = ['image', 'video', 'pdf', 'article', 'audio'];

const ContentSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    link: { type: String, required: true },
    tags: [{ type: ObjectId, ref: 'Tag' }],
    creatorId: { type: ObjectId, ref: 'User', required: true },
    previewhtml: {type: String}
});

export const ContentModel = mongoose.model("Content", ContentSchema);

const LinkShareSchema = new Schema({
    hash: { type: String, require: true },
    contentId: { type: ObjectId, required: true, ref: 'Content' }
});

export const LinkShareModel = mongoose.model("LinkShare", LinkShareSchema);

const TagSchema = new Schema({
    title: { type: String, required: true },
    contentId: [{type: ObjectId, ref: 'Content' }]
});

export const TagModel = mongoose.model("Tag", TagSchema);