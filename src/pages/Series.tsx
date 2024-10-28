import React from "react";
import Nav from "../component/nav/Nav";
import HeroSectionSeries from "../component/series/HeroSectionSeries";
import PopularSeries from "../component/series/PopularSeries";
import TopRatedSeries from "../component/series/TopRatedSeries";
import AllSeries from "../component/series/AllSeries";

export default function Series() {
  return (
    <div>
      <Nav />
      <HeroSectionSeries />
      <AllSeries />
    </div>
  );
}
