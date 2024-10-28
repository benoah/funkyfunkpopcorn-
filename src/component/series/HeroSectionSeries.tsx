import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import {
  fetchTrendingSeries, // Adjust API call to fetch trending series
  fetchGenres,
  fetchSeriesVideos, // Adjust API call for series videos
} from "../../apiService";
import styled from "styled-components";

// TypeScript types for the data
type Series = {
  id: number;
  name: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
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

const HeroSectionSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState<number>(0);
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);

  // References
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Fetch genres on component mount
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to load genres");
      }
    };
    getGenres();
  }, []);

  // Fetch trending series on component mount
  useEffect(() => {
    const getTrendingSeries = async () => {
      try {
        const data = await fetchTrendingSeries("week");
        const topSeries = data.results.slice(0, 5); // Only show 5 series
        setSeries(topSeries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending series:", error);
        setLoading(false);
        setError("Failed to load series");
      }
    };

    getTrendingSeries();
  }, []);

  // Fetch the trailer when the current series changes
  useEffect(() => {
    const getTrailer = async () => {
      const currentSeries = series[currentSeriesIndex];
      if (currentSeries) {
        try {
          setIsTrailerLoading(true);
          const videos: Video[] = await fetchSeriesVideos(currentSeries.id);
          const trailer = videos.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          if (trailer) {
            setVideoKey(trailer.key);
          } else {
            setVideoKey(null);
          }
        } catch (error) {
          console.error("Error fetching series videos:", error);
          setError("Failed to load series trailer");
        } finally {
          setIsTrailerLoading(false);
        }
      }
    };
    getTrailer();
  }, [currentSeriesIndex, series]);

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <Section>
        <div className="text-center">
          <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin mb-4"></div>
          <p>Loading series...</p>
        </div>
      </Section>
    );
  }

  // Display error message if fetching data failed
  if (error) {
    return (
      <Section>
        <p>{error}</p>
      </Section>
    );
  }

  // Map genres for display
  const genreMap: Record<number, string> = genres.reduce<
    Record<number, string>
  >((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    beforeChange: (_: any, next: number) => {
      setCurrentSeriesIndex(next);
    },
  };

  // Current series
  const currentSeries = series[currentSeriesIndex];

  // Watch Now button functionality
  const handleWatchNow = () => {
    if (videoKey) {
      window.open(`https://www.youtube.com/watch?v=${videoKey}`, "_blank");
    } else {
      console.warn("No trailer available.");
    }
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (screenfull.isEnabled && playerContainerRef.current) {
      screenfull.toggle(playerContainerRef.current);
    }
  };

  // Render the Hero Section
  return (
    <Section ref={playerContainerRef}>
      <Slider {...settings}>
        {series.map((ser, index) => (
          <div key={ser.id} className="relative h-screen max-h-[800px]">
            {/* Background Video/Image */}
            <div className="absolute inset-0 z-0">
              {isTrailerLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin"></div>
                </div>
              ) : videoKey && index === currentSeriesIndex ? (
                <div className="w-full h-full relative">
                  <Controls>
                    <ControlButton onClick={toggleFullScreen}>
                      Fullscreen
                    </ControlButton>
                  </Controls>
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
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/original${ser.backdrop_path}`}
                  alt={ser.name}
                  className="w-full h-full object-cover"
                />
              )}
              <Overlay />
            </div>

            {/* Series Info */}
            <div className="relative z-20 pt-48 px-6 md:px-12 lg:px-24">
              <div className="max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                  {ser.name}
                </h1>
                <div className="flex flex-wrap mt-4">
                  {ser.genre_ids.map((id) => (
                    <span
                      key={id}
                      className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2"
                    >
                      {genreMap[id]}
                    </span>
                  ))}
                </div>
                <p className="text-lg md:text-2xl mt-6 max-w-2xl line-clamp-5 leading-relaxed">
                  {ser.overview}
                </p>

                <button
                  className="mt-8 bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition-all flex items-center"
                  onClick={handleWatchNow}
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 2v20l17-10L4 2z" />
                  </svg>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </Section>
  );
};

export default HeroSectionSeries;

// Styled Components

const Section = styled.section`
  position: relative;
  background-color: black;
  color: white;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, black, transparent 60%);
  opacity: 0.8;
  z-index: 10;
`;

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
