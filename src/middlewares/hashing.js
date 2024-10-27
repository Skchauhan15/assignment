const bcrypt = require("bcrypt");

const saltRounds = 10;

const passwordHash = async (password) => {
  return new Promise((resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      return resolve(bcrypt.hashSync(password, salt));
    } catch (error) {
      return reject(error)
    }
  });
};

const passwordCompare = (password, hash) => {
  return new Promise((resolve, reject) => {
    return resolve(bcrypt.compareSync(password, hash));
  });
};

module.exports = { passwordHash, passwordCompare };
