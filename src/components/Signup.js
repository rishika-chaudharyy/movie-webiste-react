import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import app from '../firebase/firebase'; // Import your Firebase configuration
import swal from "sweetalert";
import { addDoc } from "firebase/firestore";
import { usersRef } from "../firebase/firebase"; // Import your Firestore reference
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  // Function to generate Recaptcha and initialize phone authentication
  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container', // This is the div where reCAPTCHA will be rendered
      {
        size: 'invisible', // Invisible reCAPTCHA
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      },
      auth
    );
  }

  // Function to request OTP
  const requestOtp = () => {
    setLoading(true);
    generateRecaptha(); // Generate reCAPTCHA for verification
    let appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult; // Store the confirmation result for later use
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        swal({
          text: "Error sending OTP, try again.",
          icon: "error",
          buttons: false,
          timer: 3000,
        });
        setLoading(false);
      })
  }

  // Function to verify OTP entered by the user
  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          text: "Successfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate('/login'); // Redirect to login page after successful registration
        setLoading(false);
      })
    } catch (error) {
      console.log(error);
      swal({
        text: "Invalid OTP, please try again.",
        icon: "error",
        buttons: false,
        timer: 3000,
      });
      setLoading(false);
    }
  }

  // Function to upload user data to Firestore after successful OTP verification
  const uploadData = async () => {
    try {
      await addDoc(usersRef, {
        name: form.name,
        password: form.password,
        mobile: form.mobile
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full flex flex-col mt-8 items-center">
      <h1 className="text-xl font-bold">Sign up</h1>
      {otpSent ?
        <>
          {/* OTP Verification Section */}
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="message" className="leading-7 text-sm text-gray-300">
                OTP
              </label>
              <input
                id="message"
                name="message"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={verifyOTP}
              className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              {loading ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
            </button>
          </div>
        </>
        :
        <>
          {/* User Registration Form */}
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="name" className="leading-7 text-sm text-gray-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="mobile" className="leading-7 text-sm text-gray-300">
                Mobile No.
              </label>
              <input
                type="number"
                id="mobile"
                name="mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="password" className="leading-7 text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={requestOtp}
              className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              {loading ? <TailSpin height={25} color="white" /> : "Request OTP"}
            </button>
          </div>
        </>
      }
      <div>
        <p>Already have an account? <Link to={'/login'}><span className="text-blue-500">Login</span></Link></p>
      </div>
      {/* reCAPTCHA container div */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Signup;
