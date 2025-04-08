import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import { verifyCodeSchema } from "@/schemas/verifySchema";
import { z } from "zod";

const VerifyUserEmailSchema = z.object({
  verifyCode: verifyCodeSchema,
});

const POST = async (request: Request) => {
  /*
        1. Connect to DB
        2. catch username and code from client
        3. decode the username by decodeURIComponent method and query from DB
        4. Check if the code is correct and not expired
    */
  await connectDB();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // Validation by zod
    const result = VerifyUserEmailSchema.safeParse(code);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Verification code must be 6 digits.",
        },
        { status: 401 }
      );
    }

    const isCorrectCode = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCorrectCode) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verification successfully.",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Your verification code has expired. Please signup again.",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("User verification error", error);

    return Response.json(
      {
        success: false,
        message: "User verification error",
      },
      { status: 500 }
    );
  }
};

export { POST };
