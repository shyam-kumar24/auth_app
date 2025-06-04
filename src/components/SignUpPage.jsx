import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth ,db} from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    company: "",
    agency: "",
  });

  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.company.trim()) {
      newErrors.company = "company is required";
    }
    if (!formData.agency.trim()) {
      newErrors.agency = "Agency is required";
    }

    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);
    const isValidPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
        formData.password
      );

    if (
      !isValidEmail &&
      !isValidPassword &&
      formData.email.trim() &&
      formData.password.trim()
    ) {
      newErrors.email = "Email and password are both invalid";
      newErrors.password = "Email and password are both invalid";
    }
    if (!isValidEmail && formData.email.trim()) {
      newErrors.email = "Email is not valid";
    }
    if (!isValidPassword && formData.password.trim()) {
      newErrors.password =
        "Password is not valid : password should contain one uppercase, number, lowercase and special char ";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      
    } else {

      try{
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, {
        displayName: formData.fullName,
        photoURL: "https://example.com/profile.jpg"
        });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: formData.fullName,
          phone: formData.phone,
          company: formData.company,
          agency: formData.agency,
          photoUrl: "https://example.com/profile.jpg"
        });

        dispatch(addUser({
          uid: user.uid,
          email: user.email,
          fullName: formData.fullName,
          phone: formData.phone,
          company: formData.company,
          agency: formData.agency,
          photoUrl: "https://example.com/profile.jpg"
        }));

        setErrors({});
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          password: "",
          company: "",
          agency: "",
        });
        navigate("/account");

      }catch(e){
        console.error("Signup failed: ", e.message);
        setErrors({ firebase: e.message });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow ">
        <h2 className="text-2xl font-semibold mb-6">
          Create your PopX account
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Marry Doe"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone number<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Marry Doe"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address<span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Marry Doe"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Marry Doe"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        {/* Company Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company name
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Marry Doe"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.company && <p style={{ color: "red" }}>{errors.company}</p>}
        </div>

        {/* Are you an agency */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you an Agency?<span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="agency"
                value="yes"
                checked={formData.agency === "yes"}
                onChange={handleChange}
                className="form-radio text-purple-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="agency"
                value="no"
                checked={formData.agency === "no"}
                onChange={handleChange}
                className="form-radio text-purple-600"
              />
              <span className="ml-2">No</span>
            </label>
            {errors.agency && <p style={{ color: "red" }}>{errors.agency}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => handleSubmit()}
          className="w-full h-11 flex justify-center items-center p-5 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
