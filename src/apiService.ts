import axios from "axios"; // Importerer axios for å gjøre HTTP-forespørsler

// Definerer API-nøkkel og base-URL
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Sjekker om API-nøkkelen er definert
if (!API_KEY) {
  throw new Error(
    "REACT_APP_TMDB_API_KEY is not defined. Please set it in your .env file."
  );
}

// Oppretter en axios-instans med base-URL og API-nøkkel som standardparameter
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Henter populære filmer
export const fetchPopularMovies = async () => {
  try {
    const response = await axiosInstance.get("/movie/popular"); // Gjør en GET-forespørsel til /movie/popular
    return response.data; // Returnerer dataene fra responsen
  } catch (error) {
    console.error("Error fetching popular movies:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};

// Henter videoer for en gitt film
export const fetchMovieVideos = async (movieId: number) => {
  try {
    const response = await axiosInstance.get(`/movie/${movieId}/videos`); // Gjør en GET-forespørsel til /movie/{movieId}/videos
    return response.data.results; // Returnerer en liste over videoer
  } catch (error) {
    console.error("Error fetching movie videos:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};

// Henter topprangerte filmer
export const fetchTopRatedMovies = async () => {
  try {
    const response = await axiosInstance.get("/movie/top_rated"); // Gjør en GET-forespørsel til /movie/top_rated
    return response.data; // Returnerer dataene fra responsen
  } catch (error) {
    console.error("Error fetching top-rated movies:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};

// Henter trending filmer
export const fetchTrendingMovies = async (timeWindow = "week") => {
  try {
    const response = await axiosInstance.get(`/trending/movie/${timeWindow}`); // Gjør en GET-forespørsel til /trending/movie/{timeWindow}
    return response.data; // Returnerer dataene fra responsen
  } catch (error) {
    console.error("Error fetching trending movies:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};

// Henter sjangere
export const fetchGenres = async () => {
  try {
    const response = await axiosInstance.get("/genre/movie/list"); // Gjør en GET-forespørsel til /genre/movie/list
    return response.data.genres; // Returnerer en liste over sjangere
  } catch (error) {
    console.error("Error fetching genres:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};

// Henter populære serier
export const fetchPopularSeries = async () => {
  try {
    const response = await axiosInstance.get("/tv/popular"); // Gjør en GET-forespørsel til /tv/popular
    return response.data; // Returnerer dataene fra responsen
  } catch (error) {
    console.error("Error fetching popular series:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};

// Henter topprangerte serier
export const fetchTopRatedSeries = async () => {
  try {
    const response = await axiosInstance.get("/tv/top_rated"); // Gjør en GET-forespørsel til /tv/top_rated
    return response.data; // Returnerer dataene fra responsen
  } catch (error) {
    console.error("Error fetching top-rated series:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};
