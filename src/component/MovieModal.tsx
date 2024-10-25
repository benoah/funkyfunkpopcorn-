import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PlusIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import ReactPlayer from "react-player";

// Define types
type Genre = {
  id: number;
  name: string;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres?: Genre[];
  adult?: boolean;
};

type Video = {
  key: string;
  site: string;
  type: string;
};

interface MovieModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  autoPlay?: boolean; // Autoplay prop
}

const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  open,
  onClose,
  autoPlay = false, // Default autoplay to false
}) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieDetails, setMovieDetails] = useState<Movie>(movie);
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  // Access API key from environment variables
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "YOUR_API_KEY_HERE"; // Use REACT_APP_ for React

  useEffect(() => {
    const fetchTrailerAndDetails = async () => {
      try {
        setIsTrailerLoading(true);

        // Fetch trailer and movie details concurrently
        const [trailerResponse, detailsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
          ),
        ]);

        // Parse the responses
        const trailerData = await trailerResponse.json();
        const trailer = trailerData.results.find(
          (video: Video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerUrl(trailer ? trailer.key : ""); // Set trailer URL or empty string

        const detailsData = await detailsResponse.json();
        setMovieDetails(detailsData);
      } catch (error) {
        console.error("Failed to fetch trailer or movie details", error);
      } finally {
        setIsTrailerLoading(false);
      }
    };

    if (movie) {
      fetchTrailerAndDetails();
    }
  }, [movie, API_KEY]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleEsc);
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (open && autoPlay && trailerUrl) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [open, autoPlay, trailerUrl]);

  const handlePlay = () => {
    setPlaying(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-3xl bg-gray-900 rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "-50%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-50%", opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-red-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Background Video/Image */}
            <div className="relative w-full h-64 md:h-96 bg-black">
              {isTrailerLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="h-12 w-12 border-4 border-t-red-600 border-b-red-600 border-white rounded-full animate-spin"></div>
                </div>
              ) : trailerUrl && playing ? (
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${trailerUrl}`}
                  playing
                  controls
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                />
              ) : (
                <>
                  {movie.backdrop_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <p>No image available</p>
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </>
              )}
            </div>

            {/* Movie Details */}
            <div className="p-6 text-white relative z-10 bg-black">
              {/* Movie Title */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold mb-4 text-red-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {movieDetails.title}
              </motion.h2>
              <hr />

              {/* Interactive Buttons */}
              <div className="flex items-center gap-4 mb-4 mt-8">
                {!playing && trailerUrl && (
                  <button
                    className="bg-white text-black px-6 py-2 rounded-full flex items-center hover:bg-gray-200 transition"
                    onClick={handlePlay}
                  >
                    <PlayIcon className="w-6 h-6 mr-2" />
                    Play
                  </button>
                )}
                <button className="bg-gray-800 bg-opacity-60 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
                  <PlusIcon className="w-6 h-6" />
                </button>
                <button className="bg-gray-800 bg-opacity-60 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
                  <HeartIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Movie Info */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {new Date(movieDetails.release_date).getFullYear()}
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {movieDetails.adult ? "18+" : "PG"}
                </span>
                <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm">
                  ⭐ {movieDetails.vote_average.toFixed(1)}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movieDetails.genres?.map((genre: Genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-gray-300 leading-relaxed">
                {movieDetails.overview}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
