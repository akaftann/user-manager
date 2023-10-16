import dbService from './dbServise.js'
import { hash, verify } from 'argon2'
import jwtService from './jwtService.js'

class UserService{
    async create(username, password){
        try{
            const role = await dbService.getRole('user')
            const admin = await dbService.getUserByRole('admin')
            const newUser = {
                username: username,
                password: await hash(password),
                roles: [role.value],
                boss: admin._id
            }
            const createdUser = await dbService.createUser(newUser)
            if(createdUser instanceof Error){
                throw new Error(createdUser.message)
            }
            return createdUser
        }catch(e){
            return e.message
        }
    }

    async createSubordinates(bossId, username, password){
        try{
            const role = await dbService.getRole('user')
            const newUser = {
                username: username,
                password: await hash(password),
                roles: [role.value],
                boss: bossId
            }
            const createdUser = await dbService.createSubordinate(newUser,bossId)
            if(createdUser instanceof Error){
                throw new Error(createdUser.message)
            }
            return createdUser
        }catch(e){
            return e.message
        }
    }

    async changeBoss(id, updUserId, newBossId){
        try{
            const boss = await dbService.getById(id)
            const user = await dbService.getById(updUserId)
            if(!user){
                throw new Error('User not found')
            }
            const newBoss = await dbService.getById(newBossId)
            if(!newBoss){
                throw new Error('New boss not found')
            }
            if(!boss.subordinates.includes(updUserId)){
                throw new Error('only user\'s boss can update')
            }
            const updated = await dbService.changeBoss(boss, user, newBoss)
            return updated
        }catch(e){
            return e.message
        }
    }

    async login(username, password){
        try{
            const user = await dbService.getUser(username)
            if(!user){
                throw new Error('User not found')
            }
            const isValid = await verify(user.password, password)
            if(!isValid){
                throw new Error('Invalid password')
            }
            const token = jwtService.generateToken(user._id, user.roles)
            return token

        }catch(e){
            return e.message
        }
    }

    async getRecursively(result,ids){
        if (ids.lenght === 0){
            return result
        }
        for(const id of ids){
            const user = await dbService.getById(id)
            result.push(user.username)
            await this.getRecursively(result, user.subordinates)
        }

    }

    async getUsers(id){
        const user = await dbService.getById(id)
        const result = []
        if(user.roles.includes('admin')){
            const users = await dbService.getUsers()
            users.forEach(user=>{result.push(user.username)})
        }
        else if(user.roles.includes('boss')){
            result.push(user.username)
            await this.getRecursively(result,user.subordinates)
        }else{
            result.push(user.username)
        }
        return result
    }
}
export default new UserService()
