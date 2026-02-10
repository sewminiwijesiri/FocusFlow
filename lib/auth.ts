import jwt from "jsonwebtoken";

export function getUserIdFromToken(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };

        return decoded.userId;
    } catch {
        return null;
    }
}
