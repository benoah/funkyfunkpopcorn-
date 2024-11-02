import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PlusIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import ReactPlayer from "react-player";

type Genre = {
  id: number;
  name: string;
};

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  genres?: Genre[];
  adult?: boolean;
};

type Series = {
  id: number;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  genres?: Genre[];
  adult?: boolean;
};

type Video = {
  key: string;
  site: string;
  type: string;
};

interface MovieModalProps {
  movie: Movie | Series;
  open: boolean;
  onClose: () => void;
  autoPlay?: boolean;
}

const isMovie = (media: Movie | Series): media is Movie => {
  return (media as Movie).title !== undefined;
};

const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  open,
  onClose,
  autoPlay = false,
}) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieDetails, setMovieDetails] = useState<Movie | Series>(movie);
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "YOUR_API_KEY_HERE";

  useEffect(() => {
    const fetchTrailerAndDetails = async () => {
      try {
        setIsTrailerLoading(true);
        const mediaType = isMovie(movie) ? "movie" : "tv";
        const [trailerResponse, detailsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${movie.id}/videos?api_key=${API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/${mediaType}/${movie.id}?api_key=${API_KEY}`
          ),
        ]);

        const trailerData = await trailerResponse.json();
        const trailer = trailerData.results.find(
          (video: Video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerUrl(trailer ? trailer.key : "");

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-lg"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-3xl bg-[#151717] rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "-50%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-50%", opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top Right Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-[#F7C600] text-2xl font-bold hover:text-red-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

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
                      alt={isMovie(movie) ? movie.title : movie.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <p>No image available</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </>
              )}
            </div>

            <div className="p-6 text-white relative z-10 bg-[#151717]">
              <motion.h2
                className="text-2xl md:text-3xl font-bold mb-4 text-[#F7C600]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isMovie(movie) ? movie.title : movie.name}
              </motion.h2>
              <hr className="border-gray-700" />

              <div className="flex items-center gap-4 mb-4 mt-8">
                {!playing && trailerUrl && (
                  <button
                    className="bg-[#F7C600] text-[#151717] px-6 py-2 rounded-full flex items-center hover:bg-yellow-400 transition"
                    onClick={handlePlay}
                  >
                    <PlayIcon className="w-6 h-6 mr-2" />
                    Play
                  </button>
                )}
                <button className="bg-[#151717] bg-opacity-60 text-[#dcdccd] px-4 py-2 rounded-full hover:bg-red-600 transition flex items-center justify-center">
                  <PlayIcon className="w-6 h-6" />
                </button>
                <button className="bg-[#151717] bg-opacity-60 text-[#dcdccd] px-4 py-2 rounded-full hover:bg-red-600 transition flex items-center justify-center">
                  <PlusIcon className="w-6 h-6" />
                </button>
                <button className="bg-[#151717] bg-opacity-60 text-[#dcdccd] px-4 py-2 rounded-full hover:bg-red-600 transition flex items-center justify-center">
                  <HeartIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {new Date(
                    isMovie(movie)
                      ? movie.release_date || "2000-01-01"
                      : movie.first_air_date || "2000-01-01"
                  ).getFullYear()}
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {movie.adult ? "18+" : "PG"}
                </span>
                <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>
              </div>

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

              <p className="text-gray-300 ml-4 mb-16 leading-relaxed">
                {movieDetails.overview}
              </p>
            </div>

            {/* Bottom Right Close Button */}
            <button
              onClick={onClose}
              className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition z-20"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
