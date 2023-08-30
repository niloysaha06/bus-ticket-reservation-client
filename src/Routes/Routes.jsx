import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../page/Home/Home/Home";
import BusView from "../page/Home/BusView/BusView";
import ThankYou from "../page/Home/ThankYou/ThankYou";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/busview/:id",
        element: <BusView />,
      },
      {
        path: "/thankyou",
        element: <ThankYou />,
      },
    ],
  },
]);
