const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  // accept multiple names from client
  // console.log('Incoming google login body:', req.body);
  const token = req.body.token || req.body.credential || req.body.id_token;
  if (!token) return res.status(401).json({ msg: 'No Google token provided' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // create user WITHOUT phoneNumber to avoid duplicate-null insertion
      user = await User.create({
        name,
        email,
        googleId: sub,
        profile_photo_url: picture,
      });
    } else if (!user.googleId) {
      // Existing email/password user: attach Google ID
      user.googleId = googleId;
      await user.save();
    }

    // Use the model's createJWT method
    const customToken = user.createJWT();

    res.status(StatusCodes.OK).json({
      user: {
        name: user.name,
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile_photo_url: user.profile_photo_url,
      },
      token: customToken,
    });
  } catch (error) {
    // console.error('Google token verify error:', error && error.message ? error.message : error);
    return res.status(401).json({ msg: 'Invalid Google token', error: error.message || error });
  }
};

const register = async (req, res) => {
  // if(!name || ! email || !password){
  //   throw new BadRequestError('Please provide name, username ad Password');
  // } // Instead we use the mongoose validator

  // hashing pass
  // const salt=await bcrypt.genSalt(10);
  // const hashedpass= await bcrypt.hash(password,salt);
  // or we could do this in pre middleware of UserSchema

  const { email, name, password } = req.body;

  // Validate presence of required fields early to give a clear error message
  if (!email || !name || !password) {
    throw new BadRequestError('Please provide name, email and password');
  }

  const user = await User.create({ email, name, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name , _id: user._id }, token });
}
const login = async (req, res) => {
  // console.log("Login attempt");
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and Password');
  }
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) throw new UnauthenticatedError('Please enter valid email and password');
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name , _id: user._id }, token });
}

module.exports = {
  googleLogin,
  register,
  login,
}