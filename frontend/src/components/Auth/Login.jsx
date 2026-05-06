import { useState } from "react";
// import { useNavigate,useLocation } from "react-router-dom";

function Login() {

  // const navigate = useNavigate();
  // const location = useLocation();
  const [form,setForm] = useState({
    email:"",
    password:""
  });

  // const handleLogin = (e)={
  //   e.preventDefault();
  //   navigate("/dashboard");
  // }
  

  return (
    <div>
      <form action="get">
        <div className="w-30 p-5 m-auto border border-gray-300 rounded-md mt-10">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="Enter your email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}  />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Enter your password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <button onClick={(e)=>{
            e.preventDefault();
          }} className="text-center p-2 mx-auto">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login
