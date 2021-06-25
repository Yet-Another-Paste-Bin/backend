import { Document, Schema, model }from "mongoose";


export type BinDocument = Document & {
  data: string,
  owner_id: string,
  owner_username: string,
  private: boolean,
  shared_with: [{ type: string }],
}

const BinSchema = new Schema<BinDocument>({
  data: String,
  owner_id: String,
  owner_username: String,
  private: Boolean,
  shared_with: [{ type: String }],
},{timestamps:true});
/**
 * Return Bin Mongoose Model
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {String} model_name
 * @param {Mongoose.Schema} scheme
 * @Return Bin Model
 */
const Bin = model<BinDocument>(
  "bins",
  BinSchema
);

export default Bin;
