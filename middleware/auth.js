require("dotenv").config();

const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(401).json({message: "No token provided"});

        try {
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            req.user = decode;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({message: "Forbidden"});
            }

            next();
        }
        catch(err) {
            res.status(400).json({message: "Invalid token"});
        }
    };
};

module.exports = authMiddleware;