import { userQueries } from '@/db/queries';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ message: 'Email, password, and full name are required.' }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const existingUser = await userQueries.getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userQueries.createUser({
      email: email,
      hashedPassword: hashedPassword,
      username: fullName,
    });

    if (!newUser) {
      console.error('Error inserting user');
      return NextResponse.json({ message: 'Could not create user. Please try again.' }, { status: 500 });
    }

    // Don't return the hashed password
    const { hashedPassword: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ message: 'User created successfully!', user: userWithoutPassword }, { status: 201 });

  } catch (error: unknown) {
    console.error('Signup API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request format.' }, { status: 400 });
    }
    return NextResponse.json({ message: (error as Error).message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
