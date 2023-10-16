import { Schema, model } from "mongoose";

const user = new Schema({
    username: {type: String, unique: true, required: true },
    password: {type: String, required: true},
    boss: {type: Schema.Types.ObjectId, ref: 'User' },
    subordinates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    roles: [{type: String, ref: 'Role', default: 'user'}]
})

const User =  model('User', user)
export default User