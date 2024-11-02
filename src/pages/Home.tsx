import React from "react";
import { motion } from "framer-motion";
import HeroSection from "../component/movie/HeroSection";
import Trending from "../component/movie/Trending";
import TopRatedMovies from "../component/movie/TopRatedMovies";
import TopRatedSeries from "../component/series/TopRatedSeries";
import PopularSeries from "../component/series/PopularSeries";
import UpcomingMovies from "../component/movie/ UpcomingMovies";
// Import the new component

export default function Home() {
  return (
    <div className="home-page text-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      <div className="content-section px-4 sm:px-8 lg:px-16 py-28 space-y-10">
        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-4"
        >
          <Trending />
        </motion.div>

        {/* Top Rated Movies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          <TopRatedMovies />
        </motion.div>

        {/* Popular Series Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4"
        >
          <PopularSeries />
        </motion.div>

        {/* Top Rated Series Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <TopRatedSeries />
        </motion.div>

        {/* Upcoming Movies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-4"
        >
          <UpcomingMovies />
        </motion.div>
      </div>
    </div>
  );
}
