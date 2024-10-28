import React, { useState, useEffect, useRef } from "react";
import { fetchGenres, fetchPopularSeries } from "../../apiService";
import MovieModal from "../movie/MovieModal";

// Define Series and Genre types
type Series = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  original_language: string;
  production_countries?: { iso_3166_1: string; name: string }[];
};

type Genre = {
  id: number;
  name: string;
};

const PopularSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres.");
      }
    };
    getGenres();
  }, []);

  const getSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPopularSeries();

      const seriesWithDetails = await Promise.all(
        data.results.map(async (series: Series) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${series.id}?api_key=YOUR_API_KEY_HERE&language=en-US`
          );
          const seriesDetails = await response.json();
          return { ...series, ...seriesDetails };
        })
      );

      setSeries(seriesWithDetails);
    } catch (error) {
      console.error("Error fetching popular series:", error);
      setError("Failed to fetch popular series.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSeries();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: -Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth",
      });
    }
  };

  const openModal = (series: Series, autoPlay = false) => {
    setSelectedSeries(series);
    setAutoPlay(autoPlay);
  };

  const closeModal = () => {
    setSelectedSeries(null);
    setAutoPlay(false);
  };

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  return (
    <div className="bg-black text-white py-8 pt-16">
      <div>
        <h4 className="text-3xl font-bold text-white mb-8">Popular Series</h4>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={getSeries}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}
      <div className="relative group">
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

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4 py-4 snap-x snap-mandatory scroll-smooth no-scrollbar"
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
            : series.map((series, index) => (
                <div
                  key={series.id}
                  className="relative snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105"
                >
                  {/* Rank Badge */}
                  <div className="absolute -bottom-6 left-2 bg-white/10 text-white font-extrabold text-3xl w-16 h-16 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg transform transition-transform duration-300 hover:scale-110">
                    {index + 1}
                  </div>
                  <img
                    src={
                      series.poster_path
                        ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={`Poster of ${series.name}`}
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <button
                    onClick={() => openModal(series, true)}
                    className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-md"
                  >
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

      {selectedSeries && (
        <MovieModal
          movie={selectedSeries}
          open={true}
          onClose={closeModal}
          autoPlay={autoPlay}
        />
      )}
    </div>
  );
};

export default PopularSeries;
