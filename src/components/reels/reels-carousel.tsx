"use client";

import { useRef, useEffect, useCallback } from "react";

export function ReelsCarousel({ reels }: { reels: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Swipe horizontally (drag scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onDown = (e: any) => {
      isDown = true;
      startX = e.pageX || e.touches?.[0]?.pageX;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
    };

    const onUp = () => {
      isDown = false;
      container.style.cursor = "grab";
    };

    const onMove = (e: any) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX || e.touches?.[0]?.pageX;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", onDown);
    container.addEventListener("mouseleave", onUp);
    container.addEventListener("mouseup", onUp);
    container.addEventListener("mousemove", onMove);
    container.addEventListener("touchstart", onDown);
    container.addEventListener("touchend", onUp);
    container.addEventListener("touchmove", onMove);

    return () => {
      container.removeEventListener("mousedown", onDown);
      container.removeEventListener("mouseleave", onUp);
      container.removeEventListener("mouseup", onUp);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("touchstart", onDown);
      container.removeEventListener("touchend", onUp);
      container.removeEventListener("touchmove", onMove);
    };
  }, []);

  // Plays only center reel
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const video = entry.target as HTMLVideoElement;

      if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
        // Center reel → play muted until clicked
        video.muted = true;
        video.play().catch(() => {});
      } else {
        // Other reels → pause & reset
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.8, 1], // center accuracy
      root: containerRef.current,
      rootMargin: "0px",
    });

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  // Unmute when clicked
  const handleClick = (e: any) => {
    const video = e.currentTarget;
    if (video.muted) {
      video.muted = false;
    }
    video.play().catch(() => {});
  };

  return (
    <div
      ref={containerRef}
      className="flex space-x-4 overflow-x-auto snap-x snap-mandatory no-scrollbar py-2 cursor-grab"
    >
      {reels.map((reel, index) => (
        <video
          key={reel.id}
          ref={(el) => (videoRefs.current[index] = el)}
          src={reel.videoUrl}
          preload="metadata"
          playsInline
          muted
          className="w-[230px] h-[410px] rounded-lg border object-cover flex-shrink-0 snap-center"
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
