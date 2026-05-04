
import jwt from 'jsonwebtoken'
const { verify } = jwt

export function verifyToken(req, res, next) {
   
    // token verfication 
    // to access cookies propert of req obj we need to cookie parse middle ware other wise req.cok=okiesd it undefined 
    const token = req.cookies?.token
   
    // if req from unauthorised
    if (!token) {
        return res.status(401).json({ message: "plz login" })
    }
    try {
        const decodedToken = verify(token, 'abcdf');
        console.log(decodedToken)
     
        req.user = decodedToken
        next()  
    } catch (err) {
        res.status(401).json({ message: "session expried.plz relogin" })
    }
} 