import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Define cursor variants and type cursorVariant accordingly
  const [cursorVariant, setCursorVariant] = useState<
    "default" | "hover" | "click"
  >("default");

  // Define your color palette here
  const variants = {
    default: {
      scale: 1,
      background: "linear-gradient(45deg, #FFB1B1, #FF8888)",
      boxShadow: "0px 0px 8px rgba(255, 177, 177, 0.4)",
    },
    hover: {
      scale: 1.5,
      background: "linear-gradient(45deg, #FF8888, #DCDCCD)",
      boxShadow: "0px 0px 12px rgba(255, 136, 136, 0.6)",
    },
    click: {
      scale: 1.2,
      background: "linear-gradient(45deg, #DCDCCD, #FFB1B1)",
      boxShadow: "0px 0px 16px rgba(220, 220, 205, 0.8)",
    },
  };

  const [trailPositions, setTrailPositions] = useState([{ x: 0, y: 0 }]);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setTrailPositions((prevPositions) => [
      { x: e.clientX, y: e.clientY },
      ...prevPositions.slice(0, 4),
    ]);
  };

  const handleMouseEnter = () => setCursorVariant("hover");
  const handleMouseLeave = () => setCursorVariant("default");
  const handleClick = () => {
    setCursorVariant("click");
    setTimeout(() => setCursorVariant("default"), 200);
  };

  useEffect(() => {
    document.querySelectorAll("[data-cursor='pointer']").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      el.addEventListener("click", handleClick);
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.querySelectorAll("[data-cursor='pointer']").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("click", handleClick);
      });
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          width: 30,
          height: 30,
          borderRadius: "50%",
        }}
        animate={{
          x: mousePosition.x - 15,
          y: mousePosition.y - 15,
          ...variants[cursorVariant],
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />

      {/* Trailing Dots */}
      {trailPositions.map((pos, index) => (
        <motion.div
          key={index}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 20 - index * 2,
            height: 20 - index * 2,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 177, 177, 0.6)", // Trail color matches cursor palette
            zIndex: 9998 - index,
            pointerEvents: "none",
            opacity: 1 - index * 0.2,
          }}
          animate={{
            x: pos.x - 10,
            y: pos.y - 10,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
