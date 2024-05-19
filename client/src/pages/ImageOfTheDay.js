import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/imageOfTheDay.css";

function ImageOfTheDay({ backgroundImageUrl }) {
  const [photoData, setPhotoData] = useState(null);
  const [previousPhotos, setPreviousPhotos] = useState([]);

  useEffect(() => {
    fetchPhoto();
    fetchPreviousPhotos();

    async function fetchPhoto() {
      try {
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=pVpMiLmP9aaHnBIoFiF9x82jfbxixrE9yXT1PYIv`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch photo");
        }
        const data = await res.json();
        setPhotoData(data);
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    }

    async function fetchPreviousPhotos() {
      try {
        const currentDate = new Date();
        const previousDates = [];
        for (let i = 1; i <= 5; i++) {
          const date = new Date(currentDate);
          date.setDate(date.getDate() - i);
          previousDates.push(date.toISOString().split("T")[0]);
        }

        const requests = previousDates.map((date) =>
          fetch(
            `https://api.nasa.gov/planetary/apod?api_key=pVpMiLmP9aaHnBIoFiF9x82jfbxixrE9yXT1PYIv&date=${date}`
          )
        );
        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map((res) => res.json()));
        setPreviousPhotos(data);
      } catch (error) {
        console.error("Error fetching previous photos:", error);
      }
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  if (!photoData) return null;

  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1822&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3DD')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <div className="row">
        <div className="col-md-6 order-md-2 description-container">
          <h1 className="title">{photoData.title}</h1>
          <p className="date">{photoData.date}</p>
          <p className="explanation">{photoData.explanation}</p>
          <p className="copyright">&copy; {photoData.copyright}</p>
          {photoData.media_type === "image" ? (
            <p>
              <u>View Full Image</u>:{" "}
              <a
                href={photoData.hdurl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photoData.hdurl}
              </a>
            </p>
          ) : (
            <p>
              <u>View Full Video</u>:{" "}
              <a href={photoData.url} target="_blank" rel="noopener noreferrer">
                {photoData.url}
              </a>
            </p>
          )}
        </div>
        <div className="col-md-6 order-md-1">
          <div className="image-container">
            {photoData.media_type === "image" ? (
              <img src={photoData.url} alt={photoData.title} />
            ) : (
              <iframe
                title="space-video"
                src={photoData.url}
                frameBorder="0"
                gesture="media"
                allow="encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <Slider {...settings}>
          {previousPhotos.map((photo, index) => (
            <div className="col-md-12" key={index}>
              <div className="image-container">
                {photo.media_type === "image" ? (
                  <img src={photo.url} alt={photo.title} />
                ) : (
                  <iframe
                    title={`space-video-${index}`}
                    src={photo.url}
                    frameBorder="0"
                    gesture="media"
                    allow="encrypted-media"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="description-container-1">
                <h2 className="title">{photo.title}</h2>
                <p className="date">{photo.date}</p>
                <div className="explanation-container">
                  <p className="explanation">{photo.explanation}</p>
                  <p>&copy; {photoData.date}</p>
                </div>
                {photo.media_type === "image" ? (
                  <p className="url url-no-justify">
                    <u>View Full Image</u>:{" "}
                    <a
                      href={photo.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {photo.hdurl}
                    </a>
                  </p>
                ) : (
                  <p>
                    <u>View Full Video</u>:{" "}
                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {photo.url}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ImageOfTheDay;
