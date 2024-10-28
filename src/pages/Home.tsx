import React from "react";
import HeroSection from "../component/movie/HeroSection"; // Import HeroSection
import Trending from "../component/movie/Trending";
import Nav from "../component/nav/Nav";
import TopRatedMovies from "../component/movie/TopRatedMovies";
import TopRatedSeries from "../component/series/TopRatedSeries";
import PopularSeries from "../component/series/PopularSeries";
import Footer from "../component/nav/Footer";

export default function Home() {
  return (
    <div className="home-page">
      <Nav />
      <HeroSection />
      <Trending />
      <TopRatedMovies />
      <PopularSeries />
      <TopRatedSeries />
      <Footer />
    </div>
  );
}
