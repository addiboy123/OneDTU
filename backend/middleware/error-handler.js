// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || "Something Went Wrong",
  };


  if(err.name==="ValidationError"){
    customError.msg=Object.values(err.errors).map((item)=>item.message).join(',');
    customError.statusCode=400;
  }
  if(err.name==="CastError"){
    // console.log(err);
    customError.msg=`No item found with id ${err.value}`;
    customError.statusCode=404;
  }
  if(err.code===11000){
    customError.msg=`Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode=400;
  }
  return res.status(customError.statusCode).json({msg:customError.msg});
}

module.exports = errorHandlerMiddleware
