import { ADMIN_TF_TOKEN } from "../constants/variables.js";
import jwt from "jsonwebtoken";
const adminAuth = (req, res, next) => {
    try {
        const token = req.cookies[ADMIN_TF_TOKEN];
        if (!token)
            throw new Error("Please Login.");
        const verify = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        if (!verify)
            throw new Error("Please Login.");
        if (verify.role !== "admin")
            throw new Error("Only admins are allowed.");
        req.params.adminId = verify.id;
        req.params.adminEmail = verify.email;
        req.params.role = verify.role;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Please Login.",
        });
    }
};
export default adminAuth;
