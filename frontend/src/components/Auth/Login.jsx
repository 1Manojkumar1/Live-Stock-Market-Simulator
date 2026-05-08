import { useState } from "react";
// import { useNavigate,useLocation } from "react-router-dom";

function Login() {

  // const navigate = useNavigate();
  // const location = useLocation();
  const [form,setForm] = useState({
    email:"",
    password:""
  });

  // const handleLogin = (e)=>{
  //   e.preventDefault();
  //   navigate("/dashboard");
  // }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action="get" className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="mx-auto w-12 h-12 bg-black text-white flex items-center justify-center rounded-xl font-bold text-2xl mb-4">
            C
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in to Cruzz</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="Enter your email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Enter your password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
          <button onClick={(e)=>{
            e.preventDefault();
          }} className="text-center p-2 mx-auto">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login