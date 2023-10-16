import Role from '../models/Role.js'
import User from '../models/User.js'

class DBService{

    async createUser(userData){
        try{
            const ifExists = await User.findOne({username: userData.username})
            if(ifExists){
                throw new Error('User already exists')
            }
            const newUser =  new User(userData)
            await newUser.save()
            return newUser
        }catch(e){
            return e
        }
    }

    async createSubordinate(userData,bossId){
        try{
            const ifExists = await User.findOne({username: userData.username})
            if(ifExists){
                throw new Error('User already exists')
            }
            const newUser =  new User(userData)
            await newUser.save()
            const boss = await User.findById(bossId)
            await User.findByIdAndUpdate(bossId, {$addToSet:{subordinates: newUser._id}},{ new: true })
            if(!boss.roles.includes('boss')){
                await User.findByIdAndUpdate(bossId, {$addToSet:{roles: 'boss'}},{ new: true })
            }
            return newUser
        }catch(e){
            return e
        }
    }

    async getUser(username){
        const user = await User.findOne({username})
        return user
    }

    async getUserByRole(role){
        const user = await User.findOne({roles:{$in:[role]}})
        return user
    }

    async getUsers(){
        const users = await User.find()
        return users
    }

    async getRole(value){
        const role = await Role.findOne({value})
        return role
    }

    async getById(id){
        const user = await User.findById(id)
        return user
    }
}

export default new DBService()
