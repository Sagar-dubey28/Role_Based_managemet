import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow">
      <h1 className="text-3xl font-bold mb-3">Role-Based Task Management — UI Preview</h1>
      <p className="text-gray-600">Switch user from the top-right selector to simulate Admin/Manager/User then open the dashboard.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/admin" className="px-4 py-2 bg-indigo-600 text-white rounded">Admin</Link>
        <Link to="/manager" className="px-4 py-2 bg-emerald-600 text-white rounded">Manager</Link>
        <Link to="/user" className="px-4 py-2 bg-yellow-600 text-white rounded">User</Link>
      </div>
    </div>
  );
}

export default Home;