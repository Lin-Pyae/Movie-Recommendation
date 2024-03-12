import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Movies from "./pages/Movies";
import Landing from "./pages/Landing";
import About from "./pages/About";

function App() {
  return (
    <>
      <div className="w-screen overflow-x-hidden min-h-screen mainContainer">
        {/* <nav className="w-full p-6 flex items-center justify-center text-lg gap-6 shadow-md fixed top-0 right-0">
            <Link to='/'>Home</Link>
            <Link to='/movies'>Movies</Link>
        </nav> */}
        <div>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/about" element={<About />} />
            </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
