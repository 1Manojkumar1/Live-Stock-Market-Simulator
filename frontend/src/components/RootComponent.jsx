import Navbar from "./Layout/Navbar"
import Footer from "./Layout/Footer"
import { Outlet } from "react-router"
import { Toaster } from 'react-hot-toast'

function RootComponent() {
  return (
    <div>
      <Toaster position="top-center" />
      <Navbar />
      <div className="bg-gray-200 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootComponent
