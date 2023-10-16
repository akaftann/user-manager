import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


class JwtService{
    constructor(){this.secret = process.env.SECRET}
    generateToken(id, roles){
        try{
            const payload = {
                id,
                roles
            }
            return jwt.sign(payload, this.secret,{expiresIn:"12h"})
        }catch(e){
            console.log(e.message)
        }
    }

    parseToken(token){
        const data = jwt.verify(token, this.secret)
        return data
    }
}

export default new JwtService()