import React, { useEffect, useRef, useState } from "react";
import { fetchTopRatedSeries, fetchGenres } from "../../apiService";
import MovieModal from "../movie/MovieModal";

// Define the Series type (similar to Movie type)
type Series = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

const TopRatedSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    getGenres();
  }, []);

  const getSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTopRatedSeries();
      setSeries(data.results);
    } catch (error) {
      console.error("Error fetching series:", error);
      setError("Failed to fetch top-rated series.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSeries();
  }, []);

  const openModal = (series: Series) => setSelectedSeries(series);
  const closeModal = () => setSelectedSeries(null);

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

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

  return (
    <>
      <div className="relative inline-block">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-[#dcdccd] mb-6"
          style={{
            lineHeight: "16.8px",
            letterSpacing: "normal",
          }}
        >
          Top Rated Series
        </h2>
        <div className="relative inline-block mb-4">
          <select
            id="genre-filter"
            value={selectedGenreId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedGenreId(value ? parseInt(value) : null);
            }}
            className="appearance-none px-4 py-2 bg-[#151717]/70 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffb1b1] transition-colors cursor-pointer pr-10 backdrop-blur-lg border border-[#ffffff30]"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative">
        {series.length > 5 && (
          <>
            <button
              onClick={scrollLeft}
              aria-label="Scroll Left"
              className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full"
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
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full"
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
          </>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden scrollbar-hide space-x-4 snap-x snap-mandatory scroll-smooth"
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
            : series
                .filter(
                  (serie) =>
                    selectedGenreId === null ||
                    serie.genre_ids.includes(selectedGenreId)
                )
                .map((serie) => (
                  <div
                    key={serie.id}
                    onClick={() => openModal(serie)}
                    className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105 group"
                  >
                    <div className="relative overflow-hidden rounded-md group">
                      <img
                        src={
                          serie.backdrop_path
                            ? `https://image.tmdb.org/t/p/w500${serie.backdrop_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={serie.name}
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-md p-4">
                        <h3 className="text-lg font-semibold">{serie.name}</h3>
                        <p className="text-sm text-gray-400">
                          {serie.first_air_date}
                        </p>
                        <p className="text-sm text-yellow-500">
                          Rating: {serie.vote_average}
                        </p>
                        <p className="text-sm text-gray-400">
                          Genres:{" "}
                          {serie.genre_ids
                            .map((id) => genreMap[id])
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
        </div>
      </div>

      {selectedSeries && (
        <MovieModal movie={selectedSeries} open={true} onClose={closeModal} />
      )}
    </>
  );
};

export default TopRatedSeries;
