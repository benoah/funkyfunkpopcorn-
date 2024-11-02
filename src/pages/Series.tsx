import React from "react";
import { motion } from "framer-motion";
import HeroSectionSeries from "../component/series/HeroSectionSeries";
import PopularSeries from "../component/series/PopularSeries";
import TopRatedSeries from "../component/series/TopRatedSeries";
import AllSeries from "../component/series/AllSeries";

export default function Series() {
  return (
    <div className="series-page text-white min-h-screen">
      <div className="content-section px-4 sm:px-8 lg:px-16 py-8 space-y-10">
        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-4"
        >
          <HeroSectionSeries />
        </motion.div>

        {/* Top Rated Movies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          <AllSeries />
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
      </div>
    </div>
  );
}
