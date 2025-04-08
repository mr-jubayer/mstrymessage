"use client";

import { signIn } from "next-auth/react";
import React, { SyntheticEvent } from "react";

const SingIn = () => {
  return (
    <div>
      {" "}
      <form
        onSubmit={async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
          e.preventDefault();
          await signIn("credentials", {
            identifier: "jubayer@ahmd.com",
            password: "null@undefined",
            redirect: false,
            callbackUrl: "/",
          });
        }}
        className="bg-gray-300 p-8 rounded-md shadow-md shadow-amber-200/20 m-5 w-64 mx-auto text-black"
      >
        <label>
          Username
          <input name="username" type="text" className="border" />
        </label>

        <label>
          Email address
          <input type="email" id="email" name="email" className="border" />
        </label>
        <button
          type="submit"
          className="bg-purple-600 rounded px-3 py-1 text-white mx-auto mt-2 cursor-pointer"
        >
          Sign in with Email
        </button>
      </form>
    </div>
  );
};

export default SingIn;
