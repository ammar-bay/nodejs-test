const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, pwd, fullName } = req.body;
  if (!username || !pwd || !fullName)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate)
    return res.status(409).json({ message: "Username already exist" }); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const result = await User.create({
      fullName,
      username,
      password: hashedPwd,
    });

    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
