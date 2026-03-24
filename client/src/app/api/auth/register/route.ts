import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      username,
      email,
      password,
      // Student profile fields
      nationality,
      currentCountry,
      gpa,
    } = body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Name, username, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Check existing email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check existing username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "STUDENT",
        profile: {
          create: {
            nationality: nationality || null,
            currentCountry: currentCountry || null,
            gpa: gpa ? parseFloat(gpa) : null,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
