"use client";

import { useEffect, useRef, useState } from "react";

type Props = { name: string; label: string };

// Plays muted and looping while on screen, pauses when scrolled away.
export default function DemoVideo({ name, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <figure className="demo-video">
      <video
        ref={ref}
        src={`/videos/${name}.mp4`}
        poster={`/videos/${name}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="demo-video__toggle" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}>
        {playing ? "Pause" : "Play"}
      </button>
    </figure>
  );
}
