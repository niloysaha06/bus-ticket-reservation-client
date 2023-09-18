import { useEffect, useRef, useState } from "react";
import "./BusView.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import CountDownTimer from "../../../components/Timer/CountDownTimer";
import {
  handleBookingConfirmation,
  checkAndRemoveExpiredBookings,
} from "../../../helpers/handleLocalStorage.js";

const BusView = () => {
  const { id } = useParams();
  const checkInputRef = useRef();
  const navigate = useNavigate();
  const [busData, setBusData] = useState({});
  const [seatNumber, setSeatnumber] = useState([]);
  const [ticketBookings, setTicketBookings] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const allSeats = [
    "1A",
    "1B",
    "1C",
    "1D",
    "2A",
    "2B",
    "2C",
    "2D",
    "3A",
    "3B",
    "3C",
    "3D",
    "4A",
    "4B",
    "4C",
    "4D",
    "5A",
    "5B",
    "5C",
    "5D",
    "6A",
    "6B",
    "6C",
    "6D",
    "7A",
    "7B",
    "7C",
    "7D",
    "8A",
    "8B",
    "8C",
    "8D",
    "9A",
    "9B",
    "9C",
    "9D",
    "10A",
    "10B",
    "10C",
    "10D",
    "11A",
    "11B",
    "11C",
    "11D",
    "12A",
  ];
  const [isFemale, setIsFemale] = useState(false);
  const [isMale, setIsMale] = useState(false);
  const [displayString, setDisplayString] = useState("");
  const [checkTenMins, setCheckTenMins] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });

  //form submit
  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const gender = form.gender.value;
    const busId = busData._id;
    let canBookSeat = true;
    let checkReservedSeatGender = "";
    let newArr = [];

    try {
      seatNumber.forEach(function (value, index) {
        if (value !== "12A") {
          const nextSeatNumber = getNextSeatNumber(value);
          if (nextSeatNumber && isSeatReserved(nextSeatNumber)) {
            checkReservedSeatGender =
              getGenderNameForReservedSeat(nextSeatNumber);
            if (checkReservedSeatGender) {
              if (
                (gender === "Male" && checkReservedSeatGender === "Female") ||
                (gender === "Female" && checkReservedSeatGender === "Male")
              ) {
                newArr.push(value);
              }
            }
          }
        }
      });

      if (newArr.length > 0) {
        canBookSeat = false;
      }

      if (canBookSeat) {
        const res = await axios.post(
          "https://busy-pink-sockeye-veil.cyclic.app/book-ticket",
          {
            busId,
            name,
            email,
            phone,
            gender,
            seatNumber,
            userId,
          }
        );
        if (res.status === 200) {
          alert(`
          Name: ${name},
          Email: ${email},
          Phone No.: ${phone},
          SeatNumber: ${seatNumber.join(", ")}
          
          Confirm Booking?`);

          handleBookingConfirmation(res.data.userId, seatNumber, id);

          navigate("/thankyou");
        }
      } else {
        alert(
          `You cannot reserve this seat ${newArr.join(
            ", "
          )}. Because the next seat is reserved by a ${checkReservedSeatGender}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleBusData = async () => {
    try {
      const { data } = await axios.get(
        `https://busy-pink-sockeye-veil.cyclic.app/bus/${id}`
      );
      setBusData(data?.bus);
      setTicketBookings(data?.ticketBookings);

      const updatedReservedSeats = [];

      ticketBookings.map((ticket) => {
        updatedReservedSeats.push(ticket.seatNumber);
      });
      setReservedSeats(updatedReservedSeats);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isSeatReserved = (seatNumber) => reservedSeats.includes(seatNumber);

  const disableCheckBoxCheck = (seatNumber) => {
    const checkReservedSeatNumber = reservedSeats.includes(seatNumber);
    const currentElement = checkInputRef[seatNumber];
    if (
      checkReservedSeatNumber &&
      checkTenMins &&
      checkTheCurrentUserSeatNumber(seatNumber)
    ) {
      setReservedSeats((seat) => {
        let newArr = [...seat];
        newArr = newArr.filter((item) => item !== seatNumber);
        return newArr;
      });
      currentElement.checked = true;
      return false;
    }
    return checkReservedSeatNumber;
  };

  const checkTheCurrentUserSeatNumber = (seat) => {
    return seatNumber.includes(seat);
  };
  const getGenderNameForReservedSeat = (seatNumber) => {
    const ticket = ticketBookings.find(
      (ticket) => ticket.seatNumber === seatNumber
    );
    if (ticket) {
      return ticket.gender;
    } else {
      return "";
    }
  };

  const extractLetter = (inputString) => {
    const letter = inputString.match(/[a-zA-Z]+/);
    return letter ? letter[0] : null;
  };

  const extractNumber = (inputString) => {
    const number = inputString.match(/\d+/);
    return number ? number[0] : null;
  };

  const getNextSeatNumber = (currentSeatNumber) => {
    const letter = extractLetter(currentSeatNumber);
    const number = extractNumber(currentSeatNumber);
    if (letter === "A") {
      return number + "B";
    } else if (letter === "B") {
      return number + "A";
    } else if (letter === "C") {
      return number + "D";
    } else if (letter === "D") {
      return number + "C";
    }
    return "";
  };

  useEffect(() => {
    getSingleBusData();
    checkAndRemoveExpiredBookings(
      setSeatnumber,
      setCheckTenMins,
      setDisplayString,
      setUserId,
      id,
      setUserInfo
    );

    const interval = setInterval(() => {
      checkAndRemoveExpiredBookings(
        setSeatnumber,
        setCheckTenMins,
        setDisplayString,
        setUserId,
        id,
        setUserInfo
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const getGenderForSeat = (seatNumber) => {
    const ticket = ticketBookings.find(
      (ticket) => ticket.seatNumber === seatNumber
    );

    if (ticket) {
      if (ticket.gender === "Male" && isMale) {
        return (
          <div className="badge">
            M<FaMale />
          </div>
        );
      } else if (ticket.gender === "Female" && isFemale) {
        return (
          <div className="badge">
            F<FaFemale />
          </div>
        );
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const handleGender = (e) => {
    const gender = e.target.value;
    if (gender === "Male") {
      setIsMale(true);
      setIsFemale(false);
    } else if (gender === "Female") {
      setIsMale(false);
      setIsFemale(true);
    } else {
      setIsMale(false);
      setIsFemale(false);
    }
  };

  const handleSeatNumbers = (seat) => {
    setSeatnumber((prevSeatNumber) => {
      let seatArr = [...prevSeatNumber];

      if (!seatArr.includes(seat)) {
        seatArr.push(seat);
      } else {
        seatArr = seatArr.filter((item) => item !== seat);
      }
      setDisplayString(seatArr.join(", "));
      return seatArr;
    });
  };

  const handleChange = (e) => {
    // Update userInfo state when input fields change
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mt-12">
      <div className="text-center mb-4">
        <h1 className="font-medium text-2xl">{busData?.name}</h1>
        <p className="text-lg font-normal my-2">{busData?.route}</p>
        <p className="text-lg font-normal my-2">Departure : {busData?.time}</p>
        {!isLoading && (
          <CountDownTimer id={busData?._id} dtime={busData?.time} />
        )}
      </div>
      <hr />
      <div>
        <div>
          <div className="plane">
            <div className="form-control mb-5">
              <select
                onChange={handleGender}
                className="select select-bordered w-40"
                name="gender"
              >
                <option disabled selected>
                  Select Gender
                </option>
                <option value={"Male"}>Male</option>
                <option value={"Female"}>Female</option>
              </select>
            </div>

            <form
              className="grid md:grid-cols-2 gap-10"
              onSubmit={handleConfirmSubmit}
            >
              <ol
                onChange={(e) => handleSeatNumbers(e.target.value)}
                className="cabin fuselage"
              >
                <li className="">
                  <ol className="seats grid md:grid-cols-4 gap-2" type="A">
                    {!isLoading &&
                      allSeats.map((seatNumber) => (
                        <li
                          key={seatNumber}
                          className={`seat ${
                            isSeatReserved(seatNumber) ? "reserved" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={seatNumber}
                            id={seatNumber}
                            ref={(input) => (checkInputRef[seatNumber] = input)}
                            disabled={disableCheckBoxCheck(
                              seatNumber,
                              checkInputRef[seatNumber]
                            )}
                          />

                          <label htmlFor={seatNumber}>
                            {seatNumber} {getGenderForSeat(seatNumber)}
                          </label>
                        </li>
                      ))}
                  </ol>
                </li>
              </ol>
              <div className="card-body">
                <h1 className="font-medium text-xl">
                  Seat Number : {displayString}
                </h1>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="name"
                    className="input input-bordered"
                    value={userInfo.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    className="input input-bordered"
                    value={userInfo.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone No.</span>
                  </label>
                  <input
                    type="number"
                    name="phone"
                    placeholder="phone"
                    className="input input-bordered"
                    value={userInfo.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="gender"
                  >
                    <option disabled selected>
                      select
                    </option>
                    <option value={"Male"}>Male</option>
                    <option value={"Female"}>Female</option>
                  </select>
                </div>
                <div className="form-control mt-6">
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Booking"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusView;
