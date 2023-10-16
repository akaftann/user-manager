import { Schema, model } from "mongoose";

const role = new Schema({
    value: {type: String, unique: true },
})

export default model('Role', role)