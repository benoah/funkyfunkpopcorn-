import React, { useState, useEffect } from "react";
import { fetchPopularSeries, fetchGenres } from "../../apiService";

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

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePreviousPage = () =>
    page > 1 && setPage((prevPage) => prevPage - 1);

  const seriesPerPage = 6;
  const startIndex = (page - 1) * seriesPerPage;

  // Filtered and displayed series based on selected genre and search term
  const filteredSeries = series
    .filter(
      (serie) =>
        (selectedGenreId === null ||
          serie.genre_ids.includes(selectedGenreId)) &&
        serie.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, startIndex + seriesPerPage);

  return (
    <div className="bg-black text-white py-8" style={{ paddingTop: "4rem" }}>
      <div className="px-8 mb-8">
        <h2 className="text-4xl font-extrabold mb-8 tracking-wide">
          Popular Series
        </h2>
        <p className="text-gray-400 text-sm">
          Discover the most popular series right now.
        </p>
      </div>

      {/* Genre Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 px-8">
        <button
          onClick={() => setSelectedGenreId(null)}
          className={`px-4 py-2 rounded-full ${
            selectedGenreId === null
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-300"
          } hover:bg-purple-600 transition-colors`}
        >
          All Genres
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenreId(genre.id)}
            className={`px-4 py-2 rounded-full ${
              selectedGenreId === genre.id
                ? "bg--600 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-purple-600 transition-colors`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Search Input for Series Name */}
      <div className="mb-4 px-8">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
        />
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl animate-pulse">Loading...</div>
        </div>
      ) : (
        <>
          {filteredSeries.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-400">No series available to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8">
              {filteredSeries.map((serie) => (
                <div
                  key={serie.id}
                  className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => {
                    console.log("Series clicked:", serie);
                  }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-semibold mb-1">{serie.name}</h3>
                    <p className="text-sm text-gray-300">
                      Release: {serie.first_air_date}
                    </p>
                    <div className="flex items-center mt-2">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.978a1 1 0 00.95.69h4.19c.969 0 1.371 1.24.588 1.81l-3.396 2.47a1 1 0 00-.364 1.118l1.287 3.979c.3.921-.755 1.688-1.538 1.118l-3.396-2.47a1 1 0 00-1.175 0l-3.396 2.47c-.783.57-1.838-.197-1.538-1.118l1.287-3.979a1 1 0 00-.364-1.118L2.098 9.405c-.783-.57-.38-1.81.588-1.81h4.19a1 1 0 00.95-.69l1.286-3.978z" />
                      </svg>
                      <span className="text-sm text-yellow-400">
                        {serie.vote_average}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {series.length > seriesPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-full text-white ${
                  page === 1
                    ? "bg-gray-800 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-blue-600 transition-colors"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-400">Page {page}</span>
              <button
                onClick={handleNextPage}
                disabled={startIndex + seriesPerPage >= series.length}
                className={`px-4 py-2 rounded-full text-white ${
                  startIndex + seriesPerPage >= series.length
                    ? "bg-gray-800 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-blue-600 transition-colors"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllSeries;
