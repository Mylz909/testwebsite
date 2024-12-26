import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  productName: string;
}

export default function ImageSlider({ images, productName }: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const changeImage = (nextIndex: number) => {
    if (isTransitioning || nextIndex === currentImageIndex) return;

    setIsTransitioning(true);
    setCurrentImageIndex(nextIndex);

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const nextImage = () =>
    changeImage((currentImageIndex + 1) % images.length);

  const prevImage = () =>
    changeImage(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      changeImage((currentImageIndex + 1) % images.length);
    } else if (isRightSwipe) {
      changeImage(
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative overflow-hidden bg-gray-100 aspect-square">
      <div
        ref={sliderRef}
        className="flex w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${productName} view ${idx + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 transform hover:scale-110"
        disabled={isTransitioning}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 transform hover:scale-110"
        disabled={isTransitioning}
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, idx) => (
          <div
            key={idx}
            onClick={() => changeImage(idx)}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentImageIndex
                ? "bg-white w-4"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
