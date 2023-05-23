const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  // return res.status(500).json({ message: "COULD NOT SENT REFRESH TOKEN" });
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: "Resfresh Token Cookie not found" });
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res.status(403).json({
            message:
              "Refresh Token was not found in any user's refresh token array also refresh token is either invalid or outdated",
          }); //Forbidden
        // attempted refresh token reuse!
        // possibilty is, a user is hacked because token was not found in anyuser's (which means it was deleted from user's array) array but it is a valid token and has not expired yet
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
      }
    );
    return res.status(403).json({
      message:
        "Refresh token was not found in any user's array, but token is valid which a user could be hacked",
    }); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        // expired refresh token
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      // if err occured or refresh token is in someone else's array of refresh token
      if (err || foundUser.username !== decoded.username)
        return res
          .status(403)
          .json({ message: "Refresh token is either invalid or has expired" });

      // Refresh token was still valid
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      let { password, refreshToken, ...userInfo } = { ...foundUser._doc };
      console.log("Refresh Token Renewal Successfull");
      // refresh token renewal successfull
      res.status(200).json({
        accessToken,
        role: foundUser.role,
        userInfo,
      });
    }
  );
};

module.exports = { handleRefreshToken };
