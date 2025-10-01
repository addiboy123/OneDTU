const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) throw new UnauthenticatedError("No Google token provided");

  try {
    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists by email
    let user = await User.findOne({ email });

    if (!user) {
      // Google signup: user doesn't exist
      user = await User.create({
        email,
        name,
        googleId,
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
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile_photo_url: user.profile_photo_url,
      },
      token: customToken,
    });
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError("Google login failed");
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


  const user = await User.create({ email, name, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name }, token });
}
const login = async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and Password');
  }
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) throw new UnauthenticatedError('Please enter valid email and password');
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = {
  googleLogin,
  register,
  login,
}