import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchPopularSeries, fetchGenres } from "../../apiService";
import "../../App.css"; // Your custom CSS, if needed

type Series = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
};

type Genre = {
  id: number;
  name: string;
};

const AllSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const getSeries = async () => {
      try {
        setLoading(true);
        setError(null);

        const seriesData = await fetchPopularSeries();
        if (!seriesData || !Array.isArray(seriesData.results)) {
          throw new Error("Invalid series data structure");
        }
        setSeries(seriesData.results);
      } catch (error) {
        console.error("Error fetching series:", error);
        setError("Failed to fetch popular series.");
      } finally {
        setLoading(false);
      }
    };
    getSeries();
  }, []);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to load genres.");
      }
    };
    getGenres();
  }, []);

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePreviousPage = () =>
    page > 1 && setPage((prevPage) => prevPage - 1);

  const seriesPerPage = 6;
  const startIndex = (page - 1) * seriesPerPage;

  const filteredSeries = series
    .filter(
      (serie) =>
        (selectedGenreId === null ||
          serie.genre_ids.includes(selectedGenreId)) &&
        serie.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, startIndex + seriesPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="space-y-6 text-gray-100 px-4"
    >
      <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">
        Popular Series
      </h2>
      <p className="text-gray-400 text-xs mb-6">
        Discover the most popular series right now.
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setSelectedGenreId(null)}
          className={`genre-button fancy-small ${
            selectedGenreId === null ? "active" : ""
          }`}
        >
          All Genres
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenreId(genre.id)}
            className={`genre-button fancy-small ${
              selectedGenreId === genre.id ? "active" : ""
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-3 py-1.5 bg-gray-800 text-white rounded-md placeholder-gray-500 focus:ring-2 focus:ring-[#F7C600] transition"
        />
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-md animate-pulse">Loading...</div>
        </div>
      ) : (
        <>
          {filteredSeries.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-400">No series available to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSeries.map((serie) => (
                <div
                  key={serie.id}
                  className="relative bg-gray-900 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 cursor-pointer"
                >
                  <img
                    src={
                      serie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={serie.name}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                    <h3 className="text-sm font-semibold mb-1">{serie.name}</h3>
                    <p className="text-xs text-gray-400">
                      Release: {serie.first_air_date}
                    </p>
                    <div className="flex items-center mt-1">
                      <svg
                        className="w-4 h-4 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.978a1 1 0 00.95.69h4.19c.969 0 1.371 1.24.588 1.81l-3.396 2.47a1 1 0 00-.364 1.118l1.287 3.979c.3.921-.755 1.688-1.538 1.118l-3.396-2.47a1 1 0 00-1.175 0l-3.396 2.47c-.783.57-1.838-.197-1.538-1.118l1.287-3.979a1 1 0 00-.364-1.118L2.098 9.405c-.783-.57-.38-1.81.588-1.81h4.19a1 1 0 00.95-.69l1.286-3.978z" />
                      </svg>
                      <span className="text-xs text-yellow-400">
                        {serie.vote_average}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {series.length > seriesPerPage && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`fancy-small ${
                  page === 1 ? "bg-gray-800 text-gray-500" : ""
                }`}
              >
                Previous
              </button>
              <span className="text-xs text-gray-400">Page {page}</span>
              <button
                onClick={handleNextPage}
                disabled={startIndex + seriesPerPage >= series.length}
                className={`fancy-small ${
                  startIndex + seriesPerPage >= series.length
                    ? "bg-gray-800 text-gray-500"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AllSeries;
