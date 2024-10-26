import { useState } from "react";

function useGeolocation(difaultPosition = null) {
  const [position, setPosition] = useState(difaultPosition);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("your browser not support GEOLOCATION");
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (sec) => {
        setPosition({ lat: sec.coords.latitude, lng: sec.coords.longitude });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setPosition(false);
      }
    );
  }

  return { position, isLoading, error, getPosition };
}

export default useGeolocation;
