import axios from "axios";
import { useEffect, useState } from "react";

const CountDownTimer = ({ id, dtime }) => {
  const [countdown, setCountdown] = useState(null);
  const [showTimer, setShowTimer] = useState(false);

  function getPeriod(timeString) {
    return timeString.slice(-2).trim(); // Extracts the last two characters (AM or PM) and removes any leading/trailing spaces
  }
  const convertTimeTo24HourFormat = (timeString) => {
    let [hour, minutes] = timeString.split(":");
    let period = getPeriod(timeString);
    hour = parseInt(hour, 10);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }

    return [hour, parseInt(minutes, 10), 0, 0];
  };

  const resetSingleBusTicket = async () => {
    try {
      const res = await axios.get(
        `https://busy-pink-sockeye-veil.cyclic.app/reset-bus/${id}`
      );
      if (res.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  useEffect(() => {
    const targetTime = new Date();
    const abc = convertTimeTo24HourFormat(dtime);
    console.log(abc);
    targetTime.setHours(abc[0], abc[1], abc[2], abc[3]); // Set the target time
    console.log("targetTime", targetTime);

    const countdownInterval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = targetTime - currentTime;
      if (timeDifference <= 7200000 && timeDifference > 0) {
        setShowTimer(true);
      } else {
        setShowTimer(false);
      }
      if (timeDifference <= 0) {
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(abc[0], abc[1], abc[2], abc[3]);
        setCountdown(timeDifference);
        const resetBustTicket = resetSingleBusTicket();
        console.log(resetBustTicket);
      } else {
        setCountdown(timeDifference);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [dtime, id]);

  const hours = Math.floor(countdown / 3600000);
  const minutes = Math.floor((countdown % 3600000) / 60000);
  const seconds = Math.floor((countdown % 60000) / 1000);

  return (
    <div>
      {countdown === null ? (
        <p>Loading...</p>
      ) : (
        showTimer && (
          <h1 className="mt-5">
            Time until {dtime} : {hours} hours, {minutes} minutes, {seconds}{" "}
            seconds
          </h1>
        )
      )}
    </div>
  );
};

export default CountDownTimer;
