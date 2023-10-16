import Role from './models/Role.js'
import { validationResult } from 'express-validator'
import userService from './Services/userService.js'
import jwtService from './Services/jwtService.js'



class authController {
    async getUsers(req,res){
        const token = req.headers.authorization
        if(!token){
            return res.status(403).json('Unautorized user')
        }
        const {id} = jwtService.parseToken(token.split(' ')[1])
        const users = await userService.getUsers(id)
        res.status(200).json(users) 
    }

    async register(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json(errors)
        }
        const {username, password} = req.body
        const newUser =  await userService.create(username, password)
        if(newUser instanceof Error){
            return res.status(400).json(newUser)
        }
        res.status(200).json(newUser)
    }

    async registerSubordinates(req,res){
        const token = req.headers.authorization
        if(!token){
            return res.status(403).json('Unautorized user')
        }
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json(errors)
        }
        const {id} = jwtService.parseToken(token.split(' ')[1])
        const {username, password} = req.body
        const newUser =  await userService.createSubordinates(id,username, password)
        if(newUser instanceof Error){
            return res.status(400).json(newUser)
        }
        res.status(200).json(newUser)
    }

    async login(req,res){
        const {username, password} = req.body
        const token = await userService.login(username, password)
        if(token instanceof Error){
            return res.status(400).json(token)
        }
        res.status(200).json({token})
    }

    async changeBoss(req,res){
        const token = req.headers.authorization
        if(!token){
            return res.status(403).json('Unautorized user')
        }
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json(errors)
        }
        const {id} = jwtService.parseToken(token.split(' ')[1])
        const {updUserId, newBossId} = req.body
        const newUser =  await userService.changeBoss(id, updUserId, newBossId)
        if(newUser instanceof Error){
            return res.status(400).json(newUser)
        }
        res.status(200).json(newUser)
    }

    async createRoles(req,res){
        const userRole = new Role()
        const adminRole = new Role({value: 'admin'})
        const bossRole = new Role({value: 'boss'})
        await userRole.save()
        await adminRole.save()
        await bossRole.save()
        res.status(200).json('roles added!')
    }
}

export default new authController()