import { useEffect, useState } from "react";
import BusList from "../BusList/BusList";
import axios from "axios";

const Home = () => {
  const [busesData, setBusesData] = useState([]);

  const getBusData = async () => {
    try {
      const { data } = await axios.get(
        "https://busy-pink-sockeye-veil.cyclic.app/buses"
      );
      setBusesData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusData();
  }, []);
  // console.log(busesData);

  return (
    <div className="mt-16">
      <div className="text-center mb-4">
        <h1 className="font-medium text-2xl">Bus Ticket Reservation System </h1>
      </div>
      <BusList items={busesData} />
    </div>
  );
};

export default Home;
