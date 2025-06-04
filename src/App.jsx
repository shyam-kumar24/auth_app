import { Routes, Route } from "react-router-dom"
import Home from "./components/LandingPage"
import LoginPage from './components/LoginPage'
import SignUpPage from "./components/SignUpPage"
import AccountSettingPage from "./components/AccountSettingPage"


export default function App(){
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path="/account" element={<AccountSettingPage />}/>
      </Routes>
    </div>
  )
}