/* eslint-disable react/prop-types */
import Message from "../Message/Message";
import styles from "./CityList.module.css";
import Spinner from "../Spinner/Spinner";
import CityItem from "../cityItem/CityItem";
import { useCities } from "../../context/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
