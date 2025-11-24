import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  MailIcon,
  LockIcon,
  FileTextIcon,
  ArrowRightIcon
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/helper";

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  type FieldName = "email" | "password"

  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    email: false,
    password: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (touched[name as FieldName]) {
      const newFieldErrors = { ...fieldErrors };

      if (name === "email") {
        newFieldErrors.email = validateEmail(value);
      } else if (name === "password") {
        newFieldErrors.password = validatePassword(value);
      }
      setFieldErrors(newFieldErrors);
    }

    if (error) setError("");
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    const newFieldErrors = { ...fieldErrors };

    if (name === "email") {
      newFieldErrors.email = validateEmail(formData.email);
    } else if (name === "password") {
      newFieldErrors.password = validatePassword(formData.password);
    }

    setFieldErrors(newFieldErrors);
  };

  const isFormValid = () => {
    // Validate email and passwords
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    // Store the boolean values
    const hasNoErrors = !emailError && !passwordError;

    // To convert the string value into boolean value
    const hasAllFields = !!formData.email && !!formData.password;

    return hasNoErrors && hasAllFields;
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    // If either field contains the error, set the error and return
    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError,
        password: passwordError
      });

      setTouched({
        email: true,
        password: true,
      });

      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);

      if (response.status === 200) {
        const { token } = response.data.data;

        if (token) {
          setSuccess("Login successful");
          login(response.data.data, token);
          navigate("/dashboard");
        } else {
          setError(response.data.data.message || "Invalid credentials");
        }
      }
    } catch (error) {
      console.error(error);
      setError("An error occured during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileTextIcon className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Login to your account
          </h1>

          <p className="text-gray-600 text-sm">
            Welcome back to invoice generator
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>

            <div className="relative">
              <MailIcon
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={
                  `w-full pl-12 pr-4 py-3 border rounded-lg 
                  ${fieldErrors.email && touched.email ?
                    "border-red-300 focus:ring-red-500" :
                    "border-gray-300 focus:ring-black"
                  }`}
                placeholder="Enter your email"
              />
            </div>

            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>

            <div className="relative">
              <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={
                  `w-full pl-12 pr-12 py-3 border rounded-lg 
                  ${fieldErrors.password && touched.password ?
                    "border-red-300 focus:ring-red-500" :
                    "border-gray-300 focus:ring-black"
                  }`}
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {fieldErrors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Error/success messages */}
          {error && (
            <div className="p-3 bg-red-50 border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                {success}
              </p>
            </div>
          )}

          {/* Sign-in button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className={
              `w-full text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center
              ${isLoading || !isFormValid()
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-blue-950 to-blue-900 hover:opacity-90 cursor-pointer"
              }`
            }
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Signing in
              </>
            ) : (
              <>
                Sign in
                <ArrowRightIcon className="w-4 h-4 ml-2 " />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account {" "}
            <button
              className="text-black font-medium hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;