"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = { name: string; label: string };

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

// Plays muted and looping while on screen, pauses when scrolled away.
// A control bar lets viewers pause and scrub back to the start.
export default function DemoVideo({ name, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Controls show while the pointer is active, then get out of the way of the in-video captions.
  const [active, setActive] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined);

  const wake = () => {
    setActive(true);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => setActive(false), 2000);
  };
  useEffect(() => () => clearTimeout(idle.current), []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // Metadata can load before hydration attaches onLoadedMetadata.
    if (video.readyState >= 1) setDuration(video.duration);
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

  // timeupdate fires only ~4x a second, so follow the playhead per frame while playing.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      if (ref.current) setTime(ref.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const seek = (value: number) => {
    const video = ref.current;
    if (!video) return;
    video.currentTime = value;
    setTime(value);
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <figure
      className="demo-video"
      data-playing={playing}
      data-active={active}
      onPointerMove={wake}
      onPointerDown={wake}
      onPointerLeave={() => setActive(false)}
    >
      <video
        ref={ref}
        src={`/videos/${name}.mp4`}
        poster={`/videos/${name}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
      />
      <div className="demo-video__bar">
        <button type="button" className="demo-video__play" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}>
          {playing ? (
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1" /><rect x="9.5" y="2.5" width="3" height="11" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4a.8.8 0 0 0 1.2.7l8.4-5.2a.8.8 0 0 0 0-1.4L5.7 2.1a.8.8 0 0 0-1.2.7z" /></svg>
          )}
        </button>
        <input
          type="range"
          className="demo-video__seek"
          min={0}
          max={duration || 0}
          step={0.01}
          value={Math.min(time, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          style={{ "--progress": `${progress}%` } as CSSProperties}
        />
        <span className="demo-video__time">
          {fmt(time)} / {fmt(duration)}
        </span>
      </div>
    </figure>
  );
}
