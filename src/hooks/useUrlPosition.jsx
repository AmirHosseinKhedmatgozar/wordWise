import { useSearchParams } from "react-router-dom";

function useUrlPosition() {
  const [searchParamz] = useSearchParams();
  const lat = searchParamz.get("lat");
  const lng = searchParamz.get("lng");
  return { lat, lng };
}

export default useUrlPosition;
