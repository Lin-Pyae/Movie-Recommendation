import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Movies from "./pages/Movies";

function App() {
  return (
    <>
      <div>
        <nav className="w-full p-6 flex items-center justify-center text-lg gap-6 shadow-md">
            <Link to='/'>Home</Link>
        </nav>
        <div>
            <Routes>
              <Route path="/" element={<Movies />} />
            </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
