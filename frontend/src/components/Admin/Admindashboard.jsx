import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/users")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          View Users
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;

/* tasks:
1 : view useres
2 : loggedin users
3 : loggedout users
4 : blocked users
 */