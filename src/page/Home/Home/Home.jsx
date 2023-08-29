import { useEffect, useState } from "react";
import BusList from "../BusList/BusList";
import axios from "axios";

const Home = () => {
  const [busesData, setBusesData] = useState([]);

  const getBusData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/buses");
      setBusesData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusData();
  }, []);
  console.log(busesData);

  return (
    <div>
      <BusList items={busesData} />
    </div>
  );
};

export default Home;
