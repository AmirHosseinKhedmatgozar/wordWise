/* eslint-disable react/prop-types */
import Message from "../Message/Message";
import styles from "./CountryList.module.css";
import Spinner from "../Spinner/Spinner";
import CountryItem from "../CountryItem/CountryItem";
import { useCities } from "../../context/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCities();
  //   const countries = new Array(new Set(cities.map((city) => city.country)));
  const countries = cities.reduce(function (arr, city) {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country} />
      ))}
    </ul>
  );
}

export default CountryList;
