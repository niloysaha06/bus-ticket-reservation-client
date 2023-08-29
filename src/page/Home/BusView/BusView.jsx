import { useEffect, useState } from "react";
import "./BusView.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const BusView = () => {
  const { id } = useParams();
  const [busData, setBusData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getSingleBusData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/bus/${id}`);
      setBusData(data?.bus);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleBusData();
  }, []);

  return (
    <div className="mt-12">
      <div className="text-center mb-4">
        <h1 className="font-medium text-2xl">{busData?.name}</h1>
        <p className="text-lg font-normal my-2">Route : Dhaka - Cox Bazar</p>
        <p className="text-lg">Departure : {busData?.time}</p>
      </div>
    </div>
  );
};

export default BusView;
