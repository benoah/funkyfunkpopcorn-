import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./component/nav/Nav";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import NewPopular from "./pages/NewPopular";
import MyList from "./pages/MyList";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App bg-black">
        {/* Legg til en Tailwind container for å sentrere innholdet */}
        <div className="container mx-auto px-4">
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/series" element={<Series />} />
              {/* Legg til andre ruter her */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
/*

    <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/series" element={<Series />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/new-popular" element={<NewPopular />} />
            <Route path="/my-list" element={<MyList />} />
          </Routes>
        </div>


*/
