const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(400).json({ msg: 'No Authorization header provided.' });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(400).json({ msg: 'Invalid Authentication' });
        }

        
        const secret =process.env.SECRET
        const keyBuffer =Buffer.from(secret, 'hex');
        // console.log("Token:", token);
        // console.log("Expected secret:", secret);
        // console.log("final secret:" , keyBuffer);

        jwt.verify(token, keyBuffer, (error, user) => {
            if (error) {
                console.error("Verification error:", error.message);
                return res.status(400).json({msg: 'Token not valid' });
            }
            console.log("user:",user)
            req.user = user;

            next();
        });
        
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(500).json({ msg: error.message });
    }
};
module.exports = auth;