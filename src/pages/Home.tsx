import { useEffect, useRef, useState } from "react";
import BaseButton from "@/components/BaseButton";
import { ChevronRight } from "lucide-react";
import cLogo from "/cyc-c-logo.png";
import { useNavigate } from "react-router-dom";

const modes = ["sky", "ocean", "youtube"] as const;
type Mode = (typeof modes)[number];

const Home: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  // const [videoId, setVideoId] = useState("4Km786yl15U"); // The Best Mistake I've Ever Made
  // const [videoId, setVideoId] = useState("jqWwmIuHZtc"); // 藍色小貨車
  const [videoId, setVideoId] = useState("Jo9OZ8Y9vPY"); // Letting Go
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  useEffect(() => {
    if (!started || !mode || mode === "youtube") return;
    const video = videoRef.current;
    const audio = audioRef.current;
    if (video && audio) {
      video.muted = false;
      video.play();
      audio.play();
    }
  }, [started, mode]);

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);

    // 支援格式：
    // https://www.youtube.com/watch?v=XXXXXXXXXXX
    // https://youtu.be/XXXXXXXXXXX
    const patterns = [
      /(?:\?|\&)v=([a-zA-Z0-9_-]{11})/, // v=xxxxx
      /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/xxxxx
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        setVideoId(match[1]);
        break;
      }
    }

    // const match = url.match(/(?:\?|\&)v=([a-zA-Z0-9_-]{11})/);
    // if (match?.[1]) {
    //   setVideoId(match[1]);
    // }
  };

  const handleStart = () => {
    setStarted(true);
    const video = videoRef.current;
    if (video) {
      video.muted = true; // 預設靜音播放
      video.play();
    }
  };

  const handleReset = () => {
    setStarted(false);
    setMode(null);
    setYoutubeUrl("");
    setVideoId("Jo9OZ8Y9vPY");
    audioRef.current?.pause();
    audioRef.current?.load();
  };

  const videoSrc = `/videos/${mode}-${
    isPortrait ? "portrait" : "landscape"
  }.mp4`;

  const audioSrc = mode && mode !== "youtube" ? `/audios/${mode}.mp3` : "";

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center">
      {!started && (
        <div className="w-full gap-12 flex flex-col items-center">
          <div>
            <h1
              className="text-2xl font-bold cursor-pointer"
              onClick={() => navigate(0)}
            >
              M I N D B A Y
            </h1>
            <p className="text-selected">sound for your mind</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {modes.map((m) => (
              <BaseButton
                key={m}
                onClick={() => setMode(m)}
                className={mode === m ? "bg-selected text-black" : ""}
              >
                {m === "youtube"
                  ? "YouTube"
                  : m.charAt(0).toUpperCase() + m.slice(1)}
              </BaseButton>
            ))}
          </div>

          {mode === "youtube" && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="貼上YouTube連結或直接開始"
                value={youtubeUrl}
                onChange={handleYoutubeChange}
                className="w-full h-10 border rounded-xl shadow-md text-center text-xs"
              />
              <BaseButton onClick={handleStart}>
                Start Meditation <ChevronRight />
              </BaseButton>
            </div>
          )}

          {mode !== "youtube" && mode !== null && (
            <BaseButton onClick={handleStart} className="mt-4">
              Start Meditation <ChevronRight />
            </BaseButton>
          )}

          <div className="w-full flex justify-center items-center">
            <img src={cLogo} alt="cLogo" className="w-4 mr-2 opacity-10" />
            <span className="text-xs text-selected">
              © 2025 CYC Studio. All rights reserved.
            </span>
          </div>
        </div>
      )}

      {started && (
        <div className="relative w-full h-full">
          <h1
            onClick={handleReset}
            className="absolute z-50 top-4 left-5 text-selected sm:text-black opacity-20 text-sm cursor-pointer"
          >
            M I N D B A Y
          </h1>

          {mode !== "youtube" && (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-[100dvh] object-cover"
                autoPlay
                loop
                playsInline // iOS必備屬性
                muted
                preload="none"
              />
              <audio ref={audioRef} src={audioSrc} loop />
            </>
          )}

          {mode === "youtube" && (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-[100dvh] object-cover"
                autoPlay
                loop
                playsInline
                muted
                preload="none"
              />

              <iframe
                className="w-1/4 h-1/5 absolute top-10 left-4 opacity-20 rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
