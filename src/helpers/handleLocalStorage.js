// import axios from "axios";

// export const handleBookingConfirmation = (userid, seatNumbers, busId) => {
//   const bookingInfo = {
//     userid,
//     seatNumbers,
//     busId,
//     timestamp: new Date().getTime(),
//   };
//   const bookingKey = `booking_${new Date().getTime()}`; // Unique key for each booking
//   removePreviousStorage(busId);
//   localStorage.setItem(bookingKey, JSON.stringify(bookingInfo));
// };

// const getUserInfo = async (userid, setUserInfo) => {
//   const url = `https://busy-pink-sockeye-veil.cyclic.app/get-single-user/${userid}`;
//   const response = axios.get(url).then((response) => {
//     setUserInfo(response.data.data);
//   });
// };

// const removePreviousStorage = (busId) => {
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     if (key.startsWith("booking_")) {
//       const bookingInfo = JSON.parse(localStorage.getItem(key));
//       if (parseInt(bookingInfo.busId) === parseInt(busId)) {
//         localStorage.removeItem(key);
//       }
//     }
//   }
// };

// // Function to check and remove expired bookings
// export const checkAndRemoveExpiredBookings = (
//   setSeatNumber,
//   setCheckTenMins,
//   setDisplayString,
//   setUserId,
//   busId,
//   setUserInfo
// ) => {
//   const currentTime = new Date().getTime();
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     if (key.startsWith("booking_")) {
//       const bookingInfo = JSON.parse(localStorage.getItem(key));
//       const bookingTime = bookingInfo.timestamp;
//       const expirationTime = bookingTime + 10 * 60 * 1000; // 10 minutes
//       if (parseInt(bookingInfo.busId) === parseInt(busId)) {
//         if (currentTime >= expirationTime) {
//           localStorage.removeItem(key);
//           setCheckTenMins(false);
//           setSeatNumber([]);
//           setDisplayString("");
//           setUserId(null);
//         } else {
//           console.log("booking info", bookingInfo);
//           const storedSeatNumbers = bookingInfo.seatNumbers;
//           setSeatNumber(storedSeatNumbers);
//           setCheckTenMins(true);
//           setDisplayString(storedSeatNumbers.join(", "));
//           setUserId(bookingInfo.userid);
//           getUserInfo(bookingInfo.userid, setUserInfo);
//         }
//       }
//     }
//   }
// };
