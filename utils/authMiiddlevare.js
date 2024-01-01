import jwt from "jsonwebtoken";

export default async (req, res, next) => {
    const token = req.headers.authorization

    try {
        const decodedToken = await jwt.decode(token)

        req.id = decodedToken.id

        next()
    } catch (err) {
        res.status(403).json('Anuthorized')
    }
}