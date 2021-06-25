import { Document, Schema, model }from "mongoose";


export type UserDocument = Document & {
  username: string,
  email: string,
  password: string,
  phoneno: string,
  passwordresettoken: string,
}

const UserSchema = new Schema<UserDocument>({
  username: String,
  email: String,
  password: String,
  phoneno: String,
  passwordresettoken: String,
});
/**
 * Return User Mongoose Model
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {String} model_name
 * @param {Mongoose.Schema} scheme
 * @Return User Model
 */
const User = model<UserDocument>(
  "users",
  UserSchema
);
export default User; 

