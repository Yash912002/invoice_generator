import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  MailIcon,
  LockIcon,
  FileTextIcon,
  ArrowRightIcon,
  UserIcon
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/helper";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  type FieldName = "name" | "email" | "password" | "confirmPassword"

  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  // validation functions
  const validateName = (name: string) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be atleast 2 characters.";
    if (name.length > 50) return "Name must be less than 50 characters.";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return "Confirm password is required";
    if (confirmPassword !== password) return "Password do not match"
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real time validation
    if (touched[name as FieldName]) {
      const newFieldErrors = { ...fieldErrors };

      if (name === "name") {
        newFieldErrors.name = validateName(value);
      } else if (name === "email") {
        newFieldErrors.email = validateEmail(value);
      } else if (name === "password") {
        newFieldErrors.password = validatePassword(value);

        // Also revalidate confirm password if touched
        if (touched.confirmPassword) {
          newFieldErrors.confirmPassword = validateConfirmPassword(
            formData.confirmPassword,
            value
          );
        }
      } else if (name === "confirmPassword") {
        newFieldErrors.confirmPassword = validateConfirmPassword(
          value,
          formData.password
        );
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

    const newFieldErrors = { ...fieldErrors };

    if (name === "name") {
      newFieldErrors.name = validateName(formData.name);
    } else if (name === "email") {
      newFieldErrors.email = validateEmail(formData.email);
    } else if (name === "password") {
      newFieldErrors.password = validatePassword(formData.password);
    } else if (name === "confirmPassword") {
      newFieldErrors.confirmPassword = validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      );
    }
    setFieldErrors(newFieldErrors);
  };

  const isFormValid = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    // Store the boolean values
    const hasNoErrors = !nameError && !emailError && !passwordError && !confirmPasswordError;

    // To convert the string value into boolean value
    const hasAllFields = !!formData.name && !!formData.email && !!formData.password && !!formData.confirmPassword;

    return hasNoErrors && hasAllFields;
  };
  const handleSubmit = async () => {
    // Validate all fields before submission
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setFieldErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });

      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true
      });

      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const data = response.data.data;
      const { token } = data;

      if (response.status === 201) {
        setSuccess("Account created successfully");

        // Ṛeset the form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        })

        // Login the user immediately after successful registration
        login(data, token);
        navigate("/dashboard");
      }

    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("API Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileTextIcon className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create new account
          </h1>

          <p className="text-gray-600 text-sm">
            Join invoice generator today
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Full name
            </label>

            <div className="relative">
              <UserIcon
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={
                  `w-full pl-12 pr-4 py-3 border rounded-lg 
                  ${fieldErrors.name && touched.name ?
                    "border-red-300 focus:ring-red-500" :
                    "border-gray-300 focus:ring-black"
                  }`}
                placeholder="Enter your Full name"
              />
            </div>

            {fieldErrors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={
                  `w-full pl-12 pr-12 py-3 border rounded-lg 
                  ${fieldErrors.confirmPassword && touched.confirmPassword ?
                    "border-red-300 focus:ring-red-500" :
                    "border-gray-300 focus:ring-black"
                  }`}
                placeholder="Confirm your password"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmPassword}
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

          {/* Terms and Conditions */}
          <div className="flex items-start pt-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-black border-gray-300 rounded mt-1"
              required
            />

            <label htmlFor="terms" className="ml-2  text-sm text-gray-600">
              I agree to the {" "}
              <button className="text-black hover:underline">
                Terms of servie
              </button> {" "}
              and {" "}
              <button className="text-black hover:underline">
                Privacy Policy
              </button> {" "}
            </label>
          </div>

          {/* Sign-up button */}
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRightIcon className="w-4 h-4 ml-2 " />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account {" "}
            <button
              className="text-black font-medium hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp;