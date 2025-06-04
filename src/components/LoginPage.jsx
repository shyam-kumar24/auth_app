import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth ,db} from "../firebase";
import { addUser } from "../store/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function LoginPage() {
 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const {name,value} = e.target
    setFormData((prev) => ({...prev,[name]: value}))
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if(Object.keys(validationError).length > 0){
        setErrors(validationError)
        return
    }

    try{
        const userCredential = await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );

        const user = userCredential.user

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        const userData = docSnap.data();
        dispatch(addUser({
            uid: user.uid,
            email: user.email,
            fullName: user.displayName,
            photoUrl: user.photoURL,
            phone: userData.phone,
            company: userData.company,
            agency: userData.agency
        }));
        } else {
            console.log("No user document found in Firestore.");
        }

        setErrors({});
        navigate("/account");
    }catch(e){
        console.log(e);
        setErrors({firebaseError: 'Email or password is not correct or user might not exist.'})
    }
  }

  


  return (
    <div className="max-w-96 w-full mx-auto mt-8 md:mt-14 p-4 md:p-0 flex flex-col gap-5">
      <h1 className="text-2xl md:text-3xl font-bold">Signin to your PopX account</h1>
      <p className="text-sm md:text-base">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
      <div className="flex flex-col">
        <label htmlFor="email" className="text-violet-900 text-sm md:text-base">
          Email<span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="h-10 md:h-12 outline-violet-600 rounded-md border border-gray-400 px-3 text-sm md:text-base"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-violet-900 text-sm md:text-base">
          Password<span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
          className="h-10 md:h-12 outline-violet-600 rounded-md border border-gray-400 px-3 text-sm md:text-base"
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
      </div>
      {errors.firebaseError && <p className="text-red-600 text-sm">{errors.firebaseError}</p>}
      <button
        onClick={handleSubmit}
        className="text-center bg-violet-700 text-white h-12 rounded-md flex items-center justify-center hover:bg-violet-800 transition"
      >
        Login
      </button>
    </div>
  );
}
