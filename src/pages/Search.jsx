import React, { useState } from "react";
import { auth, logout } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser)
    })
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    {
      !user ? alert("Please Login") : alert("Search is being performed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <header className="text-2xl font-bold mb-4">Search App</header>

      {!user ? (
        <div className="text-center">
          <form
            className="mb-5 flex items-center space-x-2"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded"
            />
            <button className="bg-blue-500  text-white px-4 py-2 rounded hover:bg-blue-600">
              Search
            </button>
          </form>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              navigate("/Login"); // Navigate to the About Page
            }}
          >
            Login / Register
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg">Welcome, {user.displayName}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={logout}
            >
              Logout
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
