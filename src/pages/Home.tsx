import { useEffect, useState, useRef } from "react";
import BaseButton from "@/components/BaseButton";
import landscapeVideo from "/sky-landscape.mp4";
import portraitVideo from "/sky-portrait.mp4";
import { ChevronRight } from "lucide-react";
import cLogo from "/cyc-c-logo.png";

const Home: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [iframeReady, setIframeReady] = useState(false);
  // const [videoId, setVideoId] = useState("4Km786yl15U"); // The Best Mistake I've Ever Made
  const [videoId, setVideoId] = useState("jqWwmIuHZtc"); // 藍色小貨車
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkOrientation = () => {
      const { innerWidth, innerHeight } = window;
      setIsPortrait(innerHeight > innerWidth);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);

    const match = url.match(/(?:\?|\&)v=([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      setVideoId(match[1]);
    }
  };

  const handleStart = () => {
    setStarted(true);
    setIframeReady(true); // 在互動中觸發
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play();
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex justify-center items-center">
      {!started && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1
            className="text-2xl font-bold font-nunito cursor-pointer"
            onClick={() => {
              setStarted(false);
              setVideoId("jqWwmIuHZtc");
              setYoutubeUrl("");
            }}
          >
            MINDBAY
          </h1>
          <h2 className="font-nunito">Sound For Your Mind</h2>

          <div className="m-8 w-2/3 sm:w-1/3 flex gap-4">
            <input
              type="text"
              className="w-full h-10 border rounded-xl shadow-md text-center text-xs"
              placeholder="貼上YouTube連結或直接開始 ->"
              value={youtubeUrl}
              onChange={handleYoutubeChange}
            />
            <BaseButton className="w-16" onClick={handleStart}>
              <ChevronRight />
            </BaseButton>
          </div>

          <div className="w-full flex justify-center items-center">
            <img src={cLogo} alt="cLogo" className="w-4 mr-2" />
            <span className="text-xs font-nunito">
              © 2025 CYC Studio. All rights reserved.
            </span>
          </div>
        </div>
      )}

      {started && (
        <div className="fade-in w-full h-full relative">
          <h1
            className="z-50 p-4 text-white opacity-20 text-sm absolute font-nunito cursor-pointer"
            onClick={() => {
              setStarted(false);
              setVideoId("jqWwmIuHZtc");
              setYoutubeUrl("");
            }}
          >
            MINDBAY
          </h1>
          <video
            ref={videoRef}
            src={isPortrait ? portraitVideo : landscapeVideo}
            className="w-screen h-screen object-cover"
            autoPlay
            muted
            loop
            playsInline
          ></video>
          {iframeReady && (
            <iframe
              className="absolute w-0 h-0 top-[-9999px] left-[-9999px]"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
