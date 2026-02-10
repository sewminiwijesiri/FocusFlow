import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid" }, { status: 401 });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
    });

    return NextResponse.json({ token });
}
