import React from "react";
import HeroSection from "../component/HeroSection"; // Import HeroSection
import Trending from "../component/Trending";
import Nav from "../component/nav/Nav";

export default function Home() {
  return (
    <div className="home-page">
      <Nav />
      <HeroSection />
      <Trending />
    </div>
  );
}
