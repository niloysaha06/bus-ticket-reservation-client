import { useState, useEffect } from "react";

function parseDepartureTime(departureTimeStr) {
  const [hours, minutes] = departureTimeStr.split(":").map(Number);
  return new Date(0, 0, 0, hours, minutes, 0);
}

const DepartureTimer = ({ departureTimeStr }) => {
  const departureTime = parseDepartureTime(departureTimeStr);
  const [isVisible, setIsVisible] = useState(false);

  const calculateTimeLeft = () => {
    const now = new Date();
    let nextDeparture = new Date(now);

    // Calculate the next departure time
    if (now.getHours() >= departureTime.getHours() - 2) {
      nextDeparture.setDate(nextDeparture.getDate() + 1);
    }
    nextDeparture.setHours(
      departureTime.getHours() - 2,
      departureTime.getMinutes(),
      0
    );

    const difference = nextDeparture - now;
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(true);
    }, departureTime - Date.now() - 2 * 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  const timeLeft = calculateTimeLeft();

  return (
    <div>
      <h1>Time Remaining</h1>
      <p>
        {timeLeft.hours.toString().padStart(2, "0")}:
        {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
};

export default DepartureTimer;
