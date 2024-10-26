/* eslint-disable react/prop-types */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
const BASE_URL = `http://localhost:8000`;
const CitiesContext = createContext();

const intitialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleteded":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    default:
      throw new Error("unknown DISPACH");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispach] = useReducer(
    reducer,
    intitialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispach({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispach({ type: "cities/loaded", payload: data });
      } catch {
        dispach({ type: "rejected", payload: "error fetch data" });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === Number(id)) return;
      try {
        dispach({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispach({ type: "city/loaded", payload: data });
      } catch {
        dispach({ type: "rejected", payload: "error fetch data" });
      }
    },
    [currentCity.id]
  );

  async function creatCity(newCity) {
    try {
      dispach({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispach({ type: "city/created", payload: data });
      //in rah khoob nist dar section bad tozih mide
    } catch {
      dispach({ type: "rejected", payload: "error adding city" });
    }
  }

  async function deleteCity(id) {
    try {
      dispach({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispach({
        type: "city/deleteded",
        payload: id,
      });

      //in rah khoob nist section bad tozih mide
    } catch {
      dispach({ type: "rejected", payload: "error deleting city" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        creatCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
