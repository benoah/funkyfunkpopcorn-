// Trending.tsx

import React, { useState, useEffect, useRef } from "react";
import { fetchGenres, fetchTrendingMovies } from "../../apiService";
import MovieModal from "./MovieModal";
import { motion } from "framer-motion";

// Define Movie and Genre types
type Movie = {
  id: number;
  title: string;

  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  original_language: string;
  production_countries?: { iso_3166_1: string; name: string }[]; // Include countries
};

type Genre = {
  id: number;
  name: string;
};

const Trending = () => {
  // State to store movies, selected movie, and genre data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(false); // Autoplay control for modal
  const [loading, setLoading] = useState<boolean>(true); // Loading state for movie data
  const [error, setError] = useState<string | null>(null); // Error state for fetching issues
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week"); // Toggle between daily and weekly trending movies
  const [genres, setGenres] = useState<Genre[]>([]); // Store genres data
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for horizontal scroll container

  // Fetch genres when the component mounts
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData); // Set genres in state
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres."); // Set error if genres fetch fails
      }
    };
    getGenres();
  }, []);

  // Function to fetch trending movies based on timeWindow (day/week)
  const getMovies = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error before fetching
      const data = await fetchTrendingMovies(timeWindow); // Fetch trending movies

      // Fetch additional details for each movie to get production countries
      const moviesWithDetails = await Promise.all(
        data.results.map(async (movie: Movie) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=YOUR_API_KEY_HERE&language=en-US`
          );
          const movieDetails = await response.json();
          return { ...movie, ...movieDetails }; // Merge base data with detailed data
        })
      );

      setMovies(moviesWithDetails); // Set movies in state
      console.log(moviesWithDetails); // Log movie data
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setError("Failed to fetch trending movies."); // Set error if fetch fails
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Re-fetch movies when the timeWindow changes
  useEffect(() => {
    getMovies();
  }, [timeWindow]);

  // Scroll functions for the carousel
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: -Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth", // Smooth scrolling effect
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth", // Smooth scrolling effect
      });
    }
  };

  // Functions for opening and closing the modal
  const openModal = (movie: Movie, autoPlay = false) => {
    setSelectedMovie(movie); // Set selected movie for modal
    setAutoPlay(autoPlay); // Control autoplay on modal open
  };
  const closeModal = () => {
    setSelectedMovie(null); // Deselect movie on modal close
    setAutoPlay(false); // Reset autoplay
  };

  // Map genres for quick lookup based on genre IDs
  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  return (
    <div className="container">
      {/* Time Window Toggle Buttons */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-[#dcdccd] mb-4">
        Trending Now
      </h2>
      <div className="flex space-x-2 mb-4">
        <button
          className={`py-1 transition-all ${
            timeWindow === "day"
              ? "border-b-2 border-[#ffb1b1]  font-semibold"
              : "border-b-2 border-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => setTimeWindow("day")}
        >
          Today
        </button>
        <button
          className={`px-4 py-1 transition-all ${
            timeWindow === "week"
              ? "border-b-2 border-[#ffb1b1] text-white font-semibold"
              : "border-b-2 border-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => setTimeWindow("week")}
        >
          This Week
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={getMovies}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Movie Carousel */}
      <div className="relative group">
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll Left"
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
        >
          {/* Icon */}
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

        {/* Scroll Right Button */}
        <button
          onClick={scrollRight}
          aria-label="Scroll Right"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
        >
          {/* Icon */}
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

        {/* Movie List */}
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
                  className="relative snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={`Poster of ${movie.title}`}
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-md"
                  />
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => openModal(movie, true)} // Open modal with autoplay
                    className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-md"
                  >
                    {/* Play Icon */}
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 2v20l17-10L4 2z" />
                    </svg>
                  </button>
                </div>
              ))}
        </div>
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          open={true}
          onClose={closeModal}
          autoPlay={autoPlay} // Pass autoplay setting to modal
        />
      )}
    </div>
  );
};

export default Trending;
