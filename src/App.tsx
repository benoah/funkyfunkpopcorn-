import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./component/nav/Nav";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import NewPopular from "./pages/NewPopular";
import MyList from "./pages/MyList";
import Home from "./pages/Home";
import Footer from "./component/nav/Footer";

import "./App.css";
import CustomCursor from "./ CustomCursor";
// Fjernet mellomrom i import

function App() {
  return (
    <Router>
      <div className="App bg-black min-h-screen flex flex-col relative px-8 pb-16">
        {/* Sticky Navigation Bar */}
        <Nav className="sticky top-0 z-10 bg-black p-4" />
        <CustomCursor />

        {/* Route Components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/serier" element={<Series />} />
          {/* Sjekk at denne er riktig */}
          <Route path="/new-popular" element={<NewPopular />} />
          <Route path="/my-list" element={<MyList />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

/*
 <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/new-popular" element={<NewPopular />} />
          <Route path="/my-list" element={<MyList />} />
*/
