import { useEffect, useState } from "react";
import "./BusView.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";

const BusView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busData, setBusData] = useState({});
  const [seatNumber, setSeatnumber] = useState([]);
  const [ticketBookings, setTicketBookings] = useState([]);
  // const [ticketData, setTicketData] = useState([]);
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

    try {
      if (seatNumber !== "12A") {
        const nextSeatNumber = getNextSeatNumber(seatNumber);
        if (nextSeatNumber && isSeatReserved(nextSeatNumber)) {
          checkReservedSeatGender =
            getGenderNameForReservedSeat(nextSeatNumber);
          if (checkReservedSeatGender) {
            if (
              (gender === "Male" && checkReservedSeatGender === "Female") ||
              (gender === "Female" && checkReservedSeatGender === "Male")
            ) {
              canBookSeat = false;
            }
          }
        }
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
          }
        );
        if (res) {
          alert(`
          Name: ${name},
          Email: ${email},
          Phone No.: ${phone},
          SeatNumber: ${seatNumber}
          
          Confirm Booking?`);
        }
        if (res) {
          navigate("/thankyou");
        }
      } else {
        alert(
          `You cannot reserve this seat ${seatNumber}. Because that seat is reserved by a ${checkReservedSeatGender}`
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
  }, [isLoading]);

  const getGenderForSeat = (seatNumber) => {
    const ticket = ticketBookings.find(
      (ticket) => ticket.seatNumber === seatNumber
    );

    if (ticket) {
      console.log(ticket);
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
    console.log(gender);
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

  return (
    <div className="mt-12">
      <div className="text-center mb-4">
        <h1 className="font-medium text-2xl">{busData?.name}</h1>
        <p className="text-lg font-normal my-2">{busData?.route}</p>
        <p className="text-lg">Departure : {busData?.time}</p>
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
                  Select Gerder
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
                onChange={(e) => setSeatnumber(e.target.value)}
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
                            disabled={isSeatReserved(seatNumber)}
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
                  Seat Number : {seatNumber}
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
