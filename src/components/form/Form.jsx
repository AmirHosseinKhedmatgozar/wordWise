import { useEffect, useReducer } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "../button/Button";
import ButtonBack from "../ButtonBack";
import useUrlPosition from "../../hooks/useUrlPosition";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";
import { useCities } from "../../context/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initialState = {
  cityName: "",
  country: "",
  emoji: "",
  date: new Date(),
  notes: "",
  isLoadingGeoCoding: false,
  geoCodingError: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "updateForm":
      return {
        ...state,
        cityName: action.payloadCity,
        country: action.payloadCountry,
        emoji: action.payloadEmoji,
      };
    case "inputeCity":
      return { ...state, cityName: action.payload };
    case "inputeDate":
      return { ...state, date: action.payload };
    case "inputeNotes":
      return { ...state, notes: action.payload };
    case "start":
      return { ...state, isLoadingGeoCoding: true, geoCodingError: "" };
    case "finish":
      return { ...state, isLoadingGeoCoding: false };
    case "error":
      return { ...state, geoCodingError: action.payload };
    case "inputDate":
      return { ...state, date: action.payload };
    default:
      throw new Error("chishode");
  }
}

function Form() {
  const { lat, lng } = useUrlPosition();
  const { isLoading, creatCity } = useCities();
  const navigate = useNavigate();
  const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

  const [
    {
      cityName,
      country,
      emoji,
      date,
      notes,
      isLoadingGeoCoding,
      geoCodingError,
    },
    dispach,
  ] = useReducer(reducer, initialState);

  console.log(country, date);
  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityData() {
        try {
          dispach({ type: "start" });
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!lat && !lng) {
            throw new Error("click on your map and select city baby");
          }
          if (!data.countryCode) {
            throw new Error("not city please try again");
          }

          dispach({
            type: "updateForm",
            payloadCity: data.city || data.locality || "",
            payloadCountry: data.countryName,
            payloadEmoji: convertToEmoji(data.countryCode),
          });
        } catch (err) {
          dispach({ type: "error", payload: err.message });
        } finally {
          dispach({ type: "finish" });
        }
      }
      fetchCityData();
    },
    [lat, lng, BASE_URL]
  );

  if (isLoadingGeoCoding) return <Spinner />;
  if (geoCodingError) return <Message message={geoCodingError} />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await creatCity(newCity);
    navigate("/app");
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispach({ type: "inputeCity", payload: String(e.target.value) })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          dateFormat="dd/mm/yyyy"
          onChange={(date) => dispach({ type: "inputDate", payload: date })}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispach({ type: "inputeNotes", payload: String(e.target.value) })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">ADD</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
