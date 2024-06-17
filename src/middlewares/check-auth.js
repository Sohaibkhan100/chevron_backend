
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const verify = jwt.verify(token, "this is dummy text");
        next();
    } catch (error) {
        return res.status(401).json({
            msg: "invalid token"
        });
    }
}
