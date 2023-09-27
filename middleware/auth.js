const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if(!token)
         return res.status(401).json({ msg: "No auth token, access denied"});
        
        //if token is coming then
        const verified = jwt.verify(token, 'verificationKey');
        if(!verified) 
         return res.status(401).json({ msg: "token verification failed, authorization denied" }); 

        req.userid = verified.id;
        req.token = token;

        next();  //if this is not given then not going forward to execute api route...if it uses as middleware 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = auth;