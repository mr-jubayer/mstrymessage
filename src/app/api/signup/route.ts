import { sendVerificationEmail } from "@/helper/sendVarificationEmail";
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
      if (exitingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message:
              "This email is already exist. Please try with another email.",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exitingUserByEmail.password = hashedPassword;
        exitingUserByEmail.verifyCode = verifyCode;
        exitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await exitingUserByEmail.save();
      }
    } else {
      // create a new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      //   send user to database
      const newUser = await new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();

      // send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }
      return Response.json(
        {
          success: true,
          message: "User Registered Successfully. Please verify your email.",
        },
        { status: 200 }
      );
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
