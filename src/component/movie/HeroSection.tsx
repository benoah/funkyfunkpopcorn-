// Import Statements
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip"; // Ensure react-tooltip is installed
import "react-tooltip/dist/react-tooltip.css"; // Import react-tooltip styles

// Import your API service functions
import {
  fetchTrendingMovies,
  fetchGenres,
  fetchMovieVideos,
} from "../../apiService";

// TypeScript types for the data
type Movie = {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
};

type Genre = {
  id: number;
  name: string;
};

type Video = {
  key: string;
  type: string;
  site: string;
};

// Styled Components for HeroSection
const Section = styled.section`
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  padding: 60px;
  border-radius: 16px;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
  z-index: 10;
`;

// You can remove these if not used
const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 30;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 12px;
  border-radius: 8px;
`;

const ControlButton = styled.button`
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: #e50914;
  }
`;

const HeroSection: React.FC = () => {
  // State Management
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(0);
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);

  // State to manage visibility of movie details
  const [infoHidden, setInfoHidden] = useState<boolean>(false);

  // Refs for ReactPlayer and Container
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Genres on Mount
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        setError("Failed to load genres");
      }
    };
    getGenres();
  }, []);

  // Fetch Trending Movies on Mount
  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const data = await fetchTrendingMovies("week");
        setMovies(data.results.slice(0, 5)); // Limit to top 5 movies
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to load movies");
      }
    };
    getTrendingMovies();
  }, []);

  // Fetch Trailer When Current Movie Changes
  useEffect(() => {
    const getTrailer = async () => {
      const currentMovie = movies[currentMovieIndex];
      if (currentMovie) {
        try {
          setIsTrailerLoading(true);
          const videos: Video[] = await fetchMovieVideos(currentMovie.id);
          const trailer = videos.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setVideoKey(trailer ? trailer.key : null);
        } catch (error) {
          setError("Failed to load movie trailer");
        } finally {
          setIsTrailerLoading(false);
        }
      }
    };
    getTrailer();
  }, [currentMovieIndex, movies]);

  // Reset infoHidden when the current movie changes
  useEffect(() => {
    setInfoHidden(false);
  }, [currentMovieIndex]);

  // Loading State
  if (loading) {
    return (
      <Section>
        <div className="text-center">
          <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin mb-4"></div>
          <p>Loading movies...</p>
        </div>
      </Section>
    );
  }

  // Error State
  if (error) {
    return (
      <Section>
        <p className="text-center text-red-500">{error}</p>
      </Section>
    );
  }

  // Create a Map for Genre IDs to Names
  const genreMap: Record<number, string> = genres.reduce<
    Record<number, string>
  >((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  // Slider Settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    beforeChange: (_: any, next: number) => {
      setCurrentMovieIndex(next);
    },
  };

  const currentMovie = movies[currentMovieIndex];

  // Handle "Show/Hide Details" Button Click
  const handleWatchNow = () => {
    if (videoKey) {
      // Optionally open the trailer in a new tab
      // window.open(`https://www.youtube.com/watch?v=${videoKey}`, "_blank");
      setInfoHidden((prev) => !prev); // Toggle visibility
    } else {
      console.warn("No trailer available.");
      setInfoHidden((prev) => !prev); // Still toggle visibility
    }
  };

  // Toggle Fullscreen (Optional)
  const toggleFullScreen = () => {
    if (screenfull.isEnabled && playerContainerRef.current) {
      screenfull.toggle(playerContainerRef.current);
    }
  };
  return (
    <section
      ref={playerContainerRef}
      className="relative bg-transparent text-white p-16 rounded-2xl"
    >
      <Slider {...settings} className="container">
        {movies.map((movie, index) => (
          <div key={movie.id} className="relative h-screen max-h-[800px]">
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
              {isTrailerLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin"></div>
                </div>
              ) : videoKey && index === currentMovieIndex ? (
                <div className="w-full h-full relative">
                  <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/watch?v=${videoKey}`}
                    playing
                    muted
                    loop
                    width="100%"
                    height="100%"
                    className="react-player"
                    config={{
                      youtube: {
                        playerVars: {
                          showinfo: 0,
                          controls: 0,
                          modestbranding: 1,
                          rel: 0,
                          autoplay: 1,
                          cc_load_policy: 0,
                          cc_lang_pref: "none",
                          iv_load_policy: 3,
                          fs: 0,
                        },
                      },
                    }}
                  />
                  {/* Overlay div to cover the top 10px of the video */}
                  <div className="absolute top-0 left-0 w-full h-[10px] bg-black z-10"></div>
                </div>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-20 pt-32 md:px-12 lg:px-24 text-[#ffb1b1]">
              {/* Movie Title */}
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-[#ffb1b1]">
                {movie.title}
              </h1>

              {/* Conditionally Render Genres and Overview */}
              {!infoHidden && (
                <div className="max-w-4xl">
                  {/* Genres */}
                  <div className="flex flex-wrap mt-4">
                    {movie.genre_ids.map((id) => (
                      <span
                        key={id}
                        className="bg-white bg-opacity-20 text-white hover:bg-black px-3 py-1 rounded-full text-sm mr-2 mb-2 transition-colors"
                      >
                        {genreMap[id]}
                      </span>
                    ))}
                  </div>

                  {/* Overview */}
                  <p className="text-lg md:text-2xl mt-6 max-w-2xl line-clamp-5 leading-relaxed text-[#dcdccd]">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* "Show/Hide Details" Button */}
              <div className="mt-8 center">
                <button
                  onClick={handleWatchNow}
                  className="fancy"
                  data-tooltip-id="toggle-details-tooltip"
                  data-tooltip-content={
                    infoHidden ? "Klikk for å vise detaljer" : "skjule detaljer"
                  }
                  aria-expanded={!infoHidden} // For better accessibility
                  aria-label={infoHidden ? "Show details" : "Hide details"} // For better accessibility
                >
                  <span className="top-key"></span>
                  {infoHidden ? "Se mer" : "Se mindre"}
                  <span className="bottom-key-1"></span>
                  <span className="bottom-key-2"></span>
                </button>
                {/* Tooltip Component */}
                <Tooltip
                  id="toggle-details-tooltip"
                  place="top"
                  variant="dark"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroSection;
