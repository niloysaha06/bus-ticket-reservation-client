import { Link } from "react-router-dom";

const BusCart = ({ item }) => {
  const { _id, name, time } = item;
  return (
    <div className="card w-96 bg-base-100 shadow-xl ">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        {/* <p>{route}</p> */}
        <p className="">{time}</p>
        <Link to={`/busview/${_id}`}>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View</button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BusCart;
