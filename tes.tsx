<div className="mt-8 center">
<button
  style={{
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    cursor: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwLjUgMTZDMzAuNSAyNC4wMDgxIDI0LjAwODEgMzAuNSAxNiAzMC41QzcuOTkxODcgMzAuNSAxLjUgMjQuMDA4MSAxLjUgMTZDMS41IDcuOTkxODcgNy45OTE4NyAxLjUgMTYgMS41QzI0LjAwODEgMS41IDMwLjUgNy45OTE4NyAzMC41IDE2WiIgc3Ryb2tlPSJibGFjayIvPgo8cGF0aCBkPSJNNiA5QzcuNjU2ODUgOSA5IDcuNjU2ODUgOSA2QzkgNC4zNDMxNSA3LjY1Njg1IDMgNiAzQzQuMzQzMTUgMyAzIDQuMzQzMTUgMyA2QzMgNy42NTY4NSA0LjM0MzE1IDkgNiA5WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==") 13 16, auto`, // Adjust "16 16" if needed to set cursor hotspot
  }}
  onClick={handleWatchNow}
  className="fancy"
  data-tooltip-id="toggle-details-tooltip"
  data-tooltip-content={
    videoKey
      ? "Click to watch the trailer"
      : infoHidden
      ? "Click to hide details"
      : "Click to show details"
  }
  aria-expanded={!infoHidden}
  aria-label={
    videoKey
      ? "Watch trailer"
      : infoHidden
      ? "Hide details"
      : "Show details"
  }
>
  <span className="top-key"></span>
  {videoKey
    ? "View Info"
    : infoHidden
    ? "Hide Details"
    : "Show Details"}
  <span className="bottom-key-1"></span>
  <span className="bottom-key-2"></span>
</button>



<div className="flex flex-wrap mt-4">
                    {movie.genre_ids.map((id) => (
                      <span
                        key={id}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          padding: "0.2rem 1rem",
                          borderRadius: "0",
                          fontSize: "0.875rem",
                          marginRight: "0.5rem",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          transition: "all 0.3s ease",
                          cursor: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwLjUgMTZDMzAuNSAyNC4wMDgxIDI0LjAwODEgMzAuNSAxNiAzMC41QzcuOTkxODcgMzAuNSAxLjUgMjQuMDA4MSAxLjUgMTZDMS41IDcuOTkxODcgNy45OTE4NyAxLjUgMTYgMS41QzI0LjAwODEgMS41IDMwLjUgNy45OTE4NyAzMC41IDE2WiIgc3Ryb2tlPSJibGFjayIvPgo8cGF0aCBkPSJNNiA5QzcuNjU2ODUgOSA5IDcuNjU2ODUgOSA2QzkgNC4zNDMxNSA3LjY1Njg1IDMgNiAzQzQuMzQzMTUgMyAzIDQuMzQzMTUgMyA2QzMgNy42NTY4NSA0LjM0MzE1IDkgNiA5WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg=="), auto`,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ffb1b1")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "rgba(255, 255, 255, 0.2)")
                        }
                      >
                        {genreMap[id]}
                      </span>
                    ))}
                  </div>

                  <p className="text-lg md:text-2xl mt-6 max-w-2xl line-clamp-5 leading-relaxed text-[#dcdccd]">
                    {movie.overview}
                  </p>
                </div>
              )}
