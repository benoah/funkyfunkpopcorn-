import React from "react";
import HeroSection from "../component/movie/HeroSection"; // Import HeroSection
import Trending from "../component/movie/Trending";
import Nav from "../component/nav/Nav";
import TopRatedMovies from "../component/movie/TopRatedMovies";

export default function Home() {
  return (
    <div className="home-page">
      <Nav />
      <HeroSection />
      <Trending />
      <TopRatedMovies />
    </div>
  );
}
