const jwt = require("jsonwebtoken");
const Models = require("../models/index");
const ERROR_MESSAGES = require("../config/error");
const GlobalHelper = require("../helper/helper");

const verifyToken = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token not provided", success: false });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token", success: false });
      }

      try {
        console.log("decoded", decoded);
        const fetchData = await Models.Sessions.findOne({ user_id: decoded._id }, { __v: 0 }, { lean: true });
        console.log("fetch_data", fetchData);

        if (fetchData) {
          req.user_data = {
            _id: fetchData.user_id,
            roles: fetchData.type,
            device_type: fetchData.device_type,
          };
          console.log("verified", req.user_data);
          next();
        } else {
          await GlobalHelper.handleCustomError(ERROR_MESSAGES.UNAUTHORIZED);
        }
      } catch (dbError) {
        GlobalHelper.handleCatch(res, dbError);
      }
    });
  } catch (error) {
    GlobalHelper.handleCatch(res, error);
  }
};

module.exports = verifyToken;






// const jwt = require("jsonwebtoken");
// const redisClient = require("../config/redis"); // assuming redisClient is set up in this file
// const Models = require("../models/index");

// const verifyToken = async (req, res, next) => {
//   let { token } = req.headers;

//   if (!token) {
//     return res
//       .status(200)
//       .json({ message: "Token not provided", success: false });
//   }

//   jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
//     if (err) {
//       return res.status(200).json({ message: err.message, success: false });
//     }

//     const userId = decoded._id;

//     try {
//       // Check Redis for cached user data
//       redisClient.get(userId, async (error, cachedData) => {
//         if (error) {
//           console.error("Redis error:", error);
//           return res.status(500).json({ message: "Internal server error", success: false });
//         }

//         if (cachedData) {
//           // Data found in Redis
//           req.user_data = JSON.parse(cachedData); // Parse the cached JSON string
//           console.log("User data retrieved from Redis cache");
//           next();
//         } else {
//           // Data not in Redis, so query MongoDB
//           const fetchData = await Models.Sessions.findOne({ user_id: userId }, { __v: 0 }).lean();
//           const fetchUser = await Models.Users.findOne(
//             { _id: fetchData.user_id },
//             { roles: 1, _id: 1, email: 1, first_name: 1, last_name: 1 }
//           ).lean();

//           if (fetchData && fetchUser) {
//             // Combine session and user data if necessary
//             const userData = {
//               ...fetchData,
//               ...fetchUser
//             };

//             // Store user data in Redis with a 1-hour expiration
//             redisClient.setex(userId, 3600, JSON.stringify(userData));

//             req.user_data = userData;
//             console.log("User data retrieved from MongoDB and cached in Redis");
//             next();
//           } else {
//             return res.status(404).json({ message: "User not found", success: false });
//           }
//         }
//       });
//     } catch (error) {
//       console.error("Database error:", error);
//       res.status(500).json({ message: "Internal server error", success: false });
//     }
//   });
// };

// module.exports = verifyToken;
