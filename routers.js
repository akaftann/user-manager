import Router from 'express'
import  authController  from './controller.js'
import {check} from 'express-validator'

const router = new Router()

router.post('/register', check('username', 'username field can\'t be empty').notEmpty(),
    check('password', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    authController.register)
router.post('/subordinate', check('username', 'username field can\'t be empty').notEmpty(),
    check('password', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    authController.registerSubordinates)
router.get('/get', authController.getUsers)
router.post('/login', authController.login)
router.post('/roles',authController.createRoles)

export default router