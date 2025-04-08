import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

const GET = async (request: Request) => {
  // If user tries with other http method
  if (request.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: "Only GET method exist",
      },
      { status: 405 }
    );
  }

  await connectDB();

  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };
    // Validation by zod
    const result = UsernameQuerySchema.safeParse(queryParams);

    console.log(result); // remove

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid Search params",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const isExistingUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isExistingUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 501 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);

    return Response.json(
      {
        success: false,
        message: "username validation failed!",
      },
      { status: 500 }
    );
  }
};

export { GET };
