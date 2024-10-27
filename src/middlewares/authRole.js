const authRole = (roles) => {
    return (req, res, next) => {
      const userRole = req.user_data.roles; // Assuming `req.user` contains the logged-in user information
      if (userRole == "ADMIN") next();
      else {
        if (!roles.includes(userRole)) {
          return res.status(403).json({ message: "Access denied" }); // custom message to print
        }
        next();
      }
    };
};
  
module.exports ={ authRole }
  