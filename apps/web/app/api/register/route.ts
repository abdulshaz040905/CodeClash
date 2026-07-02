import { NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth";
import { registerUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    await registerUser(
      result.data.name,
      result.data.email,
      result.data.password
    );

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Email already exists"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 409,
        }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}