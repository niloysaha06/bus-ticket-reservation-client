import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CountDownTimer = ({ id, dtime }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null);
  const [showTimer, setShowTimer] = useState(false);

  function getPeriod(timeString) {
    return timeString.slice(-2).trim();
  }
  const convertTimeTo24HourFormat = (timeString) => {
    let [hour, minutes] = timeString.split(":");
    console.log(hour, minutes);
    let period = getPeriod(timeString);
    hour = parseInt(hour, 10);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return [hour, parseInt(minutes, 10), 0, 0];
  };

  const resetSingleBusTicket = async () => {
    try {
      const res = await axios.get(
        `https://busy-pink-sockeye-veil.cyclic.app/reset-bus/${id}`
      );
      if (res.status === 200) {
        // navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  useEffect(() => {
    const targetTime = new Date();
    const abc = convertTimeTo24HourFormat(dtime);
    targetTime.setHours(abc[0], abc[1], abc[2], abc[3]);
    const presentTime = new Date();
    console.log(targetTime);
    console.log(presentTime);

    if (targetTime > presentTime) {
      const countdownInterval = setInterval(() => {
        const currentTime = new Date();
        let timeDifference = targetTime - currentTime;
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
    } else {
      setCountdown(false);
    }
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
          <h1 style={{ color: "#dc2626" }} className="mt-5">
            Time Left : {hours} hours, {minutes} minutes, {seconds} seconds
          </h1>
        )
      )}
    </div>
  );
};

export default CountDownTimer;
