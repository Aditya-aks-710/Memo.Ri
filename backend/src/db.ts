import mongoose, { Document, Types} from "mongoose";
import { required } from "zod/v4/core/util.cjs";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profilePictureUrl: { type: String, default: '' },
}, { timestamps: true });

export const UserModel = mongoose.model("User", UserSchema);

export const contentTypes = ['image', 'video', 'pdf', 'article', 'audio'];

export interface IContent extends Document {
  title: string;
  type: string;
  link: string;
  tags: Types.ObjectId[];
  creatorId: Types.ObjectId;
  previewhtml?: string;
  description?: string;
  embedding?: number[];
}

const ContentSchema = new Schema<IContent>({
    title: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    link: { type: String, required: true },
    tags: [{ type: ObjectId, ref: 'Tag' }],
    creatorId: { type: ObjectId, ref: 'User', required: true },
    previewhtml: {type: String},
    embedding: {type: [Number], index: "vectorSearch"}
});

export const ContentModel = mongoose.model<IContent>("Content", ContentSchema);

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