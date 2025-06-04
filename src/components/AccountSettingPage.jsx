import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { removeUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function AccountSettingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [imagePreview, setImagePreview] = useState("/shyam_image.jpg");

  useEffect(() => {
    // Check if there's a user-selected image in localStorage
    const savedImage = localStorage.getItem('userProfileImage');
    if (savedImage) {
      setImagePreview(savedImage);
    }
  }, []);

  const handleSignOut = () => {
    // Clear the stored image on logout
    localStorage.removeItem('userProfileImage');
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log("Logout failed: ", error.message);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setImagePreview(imageUrl);
        // Save to localStorage to persist during session
        localStorage.setItem('userProfileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-96 w-full mx-auto mt-10 bg-gray-100 shadow shadow-gray-200 rounded-lg">
      <h1 className="bg-white h-10 pt-2 px-4 rounded-t-lg">Account setting</h1>
      <div className="flex items-center p-5">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          />
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-violet-700 text-white rounded-full p-2 cursor-pointer hover:bg-violet-800 transition"
            title="Change photo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="ml-5">
          <h2 className="font-bold">{user.fullName}</h2>
          <p>{user.email}</p>
          <p>{user.company}</p>
          <p>{user.phone}</p>
        </div>
      </div>
      <p className="p-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta cum
        ratione accusamus atque neque ab maiores autem quis architecto nemo quam
        iusto illo numquam, non beatae sapiente aperiam possimus perferendis!
      </p>
      <button
        onClick={handleSignOut}
        className="text-center bg-violet-700 text-white h-12 rounded-md flex items-center justify-center mx-5 mb-5 hover:bg-violet-800 transition"
      >
        Logout
      </button>
    </div>
  );
}