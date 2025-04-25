import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MusicSelector = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(null);

  const songs = [
    { name: "Nebula Waves", path: import.meta.env.BASE_URL + "/audio3.mp3" },
    { name: "Stellar Dreams", path: import.meta.env.BASE_URL + "/audio2.mp3" },
    { name: "Cosmic Journey", path: import.meta.env.BASE_URL + "/audio.mp3" },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSong].path;
      audioRef.current.volume = 0.05;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.log("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.log("Playback failed:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const changeSong = (index) => {
    setCurrentSong(index);
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.log("Playback failed:", error);
        setIsPlaying(false);
      });
    }
  };

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Main button */}
        <motion.button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center hover:bg-black/70 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-blue-400 ${
              isPlaying ? "animate-pulse" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isPlaying ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            )}
          </svg>
        </motion.button>

        {/* Expand button */}
        <motion.button
          onClick={toggleExpand}
          className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-blue-500/30 backdrop-blur-sm border border-blue-500/50 flex items-center justify-center hover:bg-blue-500/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>

        {/* Expanded playlist */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-0 w-64 bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4"
            >
              <h3 className="text-blue-400 text-sm font-mono mb-3">
                Space Tunes
              </h3>
              <div className="space-y-2">
                {songs.map((song, index) => (
                  <button
                    key={index}
                    onClick={() => changeSong(index)}
                    className={`w-full text-left text-sm font-mono py-1 px-2 rounded transition-colors ${
                      currentSong === index
                        ? "text-blue-400 bg-blue-500/20"
                        : "text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                    }`}
                  >
                    {song.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={songs[currentSong].path} loop preload="none" />
    </motion.div>
  );
};

export default MusicSelector;
