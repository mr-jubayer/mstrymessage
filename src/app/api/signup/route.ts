import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

const POST = async (req: Request) => {
  try {
    const { username, email, password } = await req.json();

    await connectDB();

    const existingUserVerifyByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifyByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        {
          status: 403,
        }
      );
    }

    const exitingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (exitingUserByEmail) {
      true; // coming
    } else {
      // create a new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
    }
  } catch (error) {
    console.log("Error, Registering User", error);

    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
};

export { POST };
