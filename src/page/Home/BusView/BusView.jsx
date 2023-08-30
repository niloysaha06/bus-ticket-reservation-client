import { useEffect, useState } from "react";
import "./BusView.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const BusView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busData, setBusData] = useState({});
  const [seatNumber, setSeatnumber] = useState([]);
  const [ticketBookings, setTicketBookings] = useState([]);
  const [ticketData, setTicketData] = useState([]);
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

  // console.log(seatNumber);
  // console.log(ticketBookings);
  // console.log(ticketData);
  // console.log(reservedSeat);

  //form submit
  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const gender = form.gender.value;
    const busId = busData._id;

    try {
      const res = await axios.post("http://localhost:3000/book-ticket", {
        busId,
        name,
        email,
        phone,
        gender,
        seatNumber,
      });
      navigate("/thankyou");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleBusData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/bus/${id}`);
      setBusData(data?.bus);
      setTicketBookings(data?.ticketBookings);
      ticketBookings.map((ticket, index) => {
        setTicketData(ticket);
        setReservedSeats((reservedSeats[index] = ticket.seatNumber));
      });

      ticketBookings.forEach((ticket, index) => {
        setTicketData(ticket);
        setReservedSeats((prevReservedSeats) => {
          const updatedReservedSeats = [...prevReservedSeats];
          updatedReservedSeats[index] = ticket.seatNumber;
          return updatedReservedSeats;
        });
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isSeatReserved = (seatNumber) => reservedSeats.includes(seatNumber);

  useEffect(() => {
    getSingleBusData();
  }, [isLoading]);

  return (
    <div className="mt-12">
      <div className="text-center mb-4">
        <h1 className="font-medium text-2xl">{busData?.name}</h1>
        <p className="text-lg font-normal my-2">Route : Dhaka - Cox Bazar</p>
        <p className="text-lg">Departure : {busData?.time}</p>
      </div>
      <hr />
      <div>
        <div>
          <div className="plane">
            <form
              className="grid md:grid-cols-2 gap-10"
              onSubmit={handleConfirmSubmit}
            >
              <ol className="cabin fuselage">
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
                            onChange={(e) => setSeatnumber(e.target.value)}
                            disabled={isSeatReserved(seatNumber)}
                          />
                          <label htmlFor={seatNumber}>{seatNumber}</label>
                        </li>
                      ))}
                  </ol>
                </li>
              </ol>
              <div className="card-body">
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
                    value="Confirm"
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
