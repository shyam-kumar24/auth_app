import { Link } from "react-router-dom";



export default function Home() {
  return (
    <div className="max-w-[350px] md:max-w-[500px] lg:max-w-[600px] flex flex-col gap-5 mx-auto p-4 md:p-0 mt-[50px] md:mt-[100px] h-max">
      <h1 className="text-2xl md:text-3xl font-bold">Welcome to PopX</h1>
      <p className="text-sm md:text-base">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam,
        molestias.
      </p>
      <div className="flex flex-col gap-3">
        <Link 
          to="/signup" 
          className="bg-violet-700 h-10 md:h-12 w-full flex items-center justify-center text-white rounded-md cursor-pointer hover:bg-violet-800 transition"
        >
          Create Account
        </Link>
        <Link 
          to="/login" 
          className="bg-violet-400 h-10 md:h-12 w-full flex items-center justify-center text-white rounded-md cursor-pointer hover:bg-violet-500 transition"
        >
          Already registered? Login
        </Link>
      </div>
    </div>
  );
}
