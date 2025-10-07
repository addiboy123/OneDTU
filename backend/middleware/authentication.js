const User= require('../models/User');
const jwt=require('jsonwebtoken');
const {UnauthenticatedError}= require('../errors');

const authenticationMiddleware=(req,res,next)=>{
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthenticatedError('Token not found');
    const token =authHeader.split(' ')[1];

    try{
        const payload= jwt.verify(token,process.env.JWT_SECRET);
        req.user={userId:payload.userId,name:payload.name};
        next();
    }
    catch(error){
        throw new UnauthenticatedError(`Not authorized to access this route`);
    }
}

module.exports=authenticationMiddleware;
