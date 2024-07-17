import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../../components/features/auth/authSlice";
import { AppDispatch } from "../../components/store/store";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "../../components/features/auth/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const Onboarding: React.FC = () => {
  const [email, setEmail] = useState(`${process.env.REACT_APP_DUMMY_EMAIL}`);
  const [password, setPassword] = useState(
    `${process.env.REACT_APP_DUMMY_PASSWORD}`
  );
  const dispatch = useDispatch<AppDispatch>();
  const [loginUser, { error, isError, isLoading }] = useLoginUserMutation();
  const context: any = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      const errorMessage =
        (error as FetchBaseQueryError)?.data ||
        (error as FetchBaseQueryError)?.status ||
        error;
      toast.error(`${errorMessage}`);
    }
  }, [error, isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are mandatory");
      return;
    }

    try {
      const res = await loginUser({ email, password }).unwrap();
      toast.success("User is successfully logged in");
      dispatch(loginAction({ token: res.token, email: res.email }));
      context.setToken(res?.token);
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.success("User is successfully logged in as a Guest");
    dispatch(loginAction({ token: "GUEST", email: "GUEST" }));
    context.setToken("GUEST");
  };

  useLayoutEffect(() => {
    if (context?.token) {
      navigate("/chat", { replace: true });
    }
  }, [context, navigate]);

  return (
    <div className="w-full flex items-center justify-center min-h-screen md:min-h-auto h-full bg-blue-gradient">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2
          className={`text-2xl py-2 font-bold w-full text-center rounded-[8px] cursor-pointer transition-all duration-300 mb-4`}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={process.env.REACT_APP_DUMMY_EMAIL}
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={process.env.REACT_APP_DUMMY_PASSWORD}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:grayscale text-white p-2 rounded-[8px] font-bold"
          >
            Proceed
          </button>

          <div className="text-center">
            <strong>OR</strong>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:grayscale text-white p-2 rounded-[8px] font-bold"
          >
            Proceed as Guest User
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
