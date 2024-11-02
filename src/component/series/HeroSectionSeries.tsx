import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import {
  fetchTrendingSeries,
  fetchGenres,
  fetchSeriesVideos,
} from "../../apiService";

// TypeScript types for data
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
  const [infoHidden, setInfoHidden] = useState<boolean>(false);

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const getTrendingSeries = async () => {
      try {
        const data = await fetchTrendingSeries("week");
        setSeries(data.results.slice(0, 5)); // Top 5 series
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to load series");
      }
    };
    getTrendingSeries();
  }, []);

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
          setVideoKey(trailer ? trailer.key : null);
        } catch (error) {
          setError("Failed to load series trailer");
        } finally {
          setIsTrailerLoading(false);
        }
      }
    };
    getTrailer();
  }, [currentSeriesIndex, series]);

  useEffect(() => {
    setInfoHidden(false);
  }, [currentSeriesIndex]);

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

  if (error) {
    return (
      <Section>
        <p className="text-center text-red-500">{error}</p>
      </Section>
    );
  }

  const genreMap: Record<number, string> = genres.reduce<
    Record<number, string>
  >((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

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

  const currentSeries = series[currentSeriesIndex];

  const handleWatchNow = () => {
    if (videoKey) {
      setInfoHidden((prev) => !prev);
    } else {
      console.warn("No trailer available.");
      setInfoHidden((prev) => !prev);
    }
  };

  const toggleFullScreen = () => {
    if (screenfull.isEnabled && playerContainerRef.current) {
      screenfull.toggle(playerContainerRef.current);
    }
  };

  return (
    <Section
      ref={playerContainerRef}
      className="relative bg-transparent text-white p-16 rounded-2xl"
    >
      <Slider {...settings} className="container">
        {series.map((ser, index) => (
          <div key={ser.id} className="relative h-screen max-h-[800px]">
            <div className="absolute inset-0 z-0">
              {isTrailerLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin"></div>
                </div>
              ) : videoKey && index === currentSeriesIndex ? (
                <div className="w-full h-full relative">
                  <img
                    src={`https://image.tmdb.org/t/p/original${ser.backdrop_path}`}
                    alt={ser.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-[10px] bg-black z-10"></div>
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

            <div className="relative z-20 pt-32 md:px-12 lg:px-24 text-[#ffb1b1]">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-[#ffb1b1]">
                {ser.name}
              </h1>

              {!infoHidden && (
                <div className="max-w-4xl">
                  <div className="flex flex-wrap mt-4">
                    {ser.genre_ids.map((id) => (
                      <span
                        key={id}
                        className="bg-white bg-opacity-20 text-white hover:bg-black px-3 py-1 rounded-full text-sm mr-2 mb-2 transition-colors"
                      >
                        {genreMap[id]}
                      </span>
                    ))}
                  </div>
                  <p className="text-lg md:text-2xl mt-6 max-w-2xl line-clamp-5 leading-relaxed text-[#dcdccd]">
                    {ser.overview}
                  </p>
                </div>
              )}

              <div className="mt-8 center">
                <button
                  onClick={handleWatchNow}
                  className="fancy"
                  data-tooltip-id="toggle-details-tooltip"
                  data-tooltip-content={
                    infoHidden ? "Klikk for å vise detaljer" : "skjule detaljer"
                  }
                  aria-expanded={!infoHidden}
                  aria-label={infoHidden ? "Show details" : "Hide details"}
                >
                  <span className="top-key"></span>
                  {infoHidden ? "Se mer" : "Se mindre"}
                  <span className="bottom-key-1"></span>
                  <span className="bottom-key-2"></span>
                </button>
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
    </Section>
  );
};

export default HeroSectionSeries;

// Styled Components

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

/*
                <img
                  src={`https://image.tmdb.org/t/p/original${ser.backdrop_path}`}
                  alt={ser.name}
                  className="w-full h-full object-cover"
                />
*/
