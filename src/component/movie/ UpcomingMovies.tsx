import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import MovieModal from "./MovieModal";
import {
  fetchUpcomingMovies,
  fetchTrendingSeries,
  fetchPopularSeries,
} from "../../apiService";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
};

const UpcomingMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<"movies" | "series">("movies");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadContent = async () => {
    try {
      setLoading(true);
      let data;

      if (contentType === "movies") {
        data = await fetchUpcomingMovies();
      } else if (contentType === "series") {
        data = await fetchTrendingSeries();
      }

      // Check if data is an array before setting it in movies
      if (Array.isArray(data)) {
        setMovies(data);
        setError(null);
      } else {
        console.error("Fetched data is not an array:", data);
        setError(`Failed to load ${contentType} content.`);
        setMovies([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error(`Error loading ${contentType} content:`, error);
      setError(`Failed to load ${contentType} content.`);
      setMovies([]); // Fallback to an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [contentType]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="space-y-4"
    >
      <h2
        className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-[#dcdccd] mb-16"
        style={{
          lineHeight: "16.8px",
          letterSpacing: "normal",
        }}
      >
        Upcoming Release
      </h2>

      {/* Content Type Selector */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setContentType("movies")}
          className={`py-2 px-6 rounded-md transition-all font-semibold ${
            contentType === "movies"
              ? "bg-primary text-onPrimary"
              : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-onPrimary"
          }`}
          aria-pressed={contentType === "movies"}
          aria-label="Show Movies"
        >
          Movies
        </button>
        <button
          onClick={() => setContentType("series")}
          className={`py-2 px-6 rounded-md transition-all font-semibold ${
            contentType === "series"
              ? "bg-primary text-onPrimary"
              : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-onPrimary"
          }`}
          aria-pressed={contentType === "series"}
          aria-label="Show Series"
        >
          Series
        </button>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <div className="relative group">
        {/* Scroll Buttons */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll Left"
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={scrollRight}
          aria-label="Scroll Right"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Movie or Series List */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll space-x-4 py-4 scroll-smooth scrollbar-hide"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] animate-pulse"
                >
                  <div className="bg-gray-700 h-[360px] w-full rounded-md"></div>
                  <div className="mt-2 h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => openModal(movie)}
                  className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105 group"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={`Poster of ${movie.title}`}
                    className="w-full h-auto object-cover rounded-md shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-md p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {movie.title}
                    </h3>
                    {movie.release_date && (
                      <p className="text-sm text-gray-400">
                        Release Date: {movie.release_date}
                      </p>
                    )}
                    {movie.vote_average !== undefined && (
                      <p className="text-sm text-yellow-500">
                        Rating: {movie.vote_average}
                      </p>
                    )}
                    {movie.overview && (
                      <p className="text-sm text-gray-400 mt-2">
                        {movie.overview.length > 100
                          ? `${movie.overview.substring(0, 100)}...`
                          : movie.overview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} open={true} onClose={closeModal} />
      )}
    </motion.div>
  );
};

export default UpcomingMovies;
