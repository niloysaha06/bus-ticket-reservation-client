import BusCart from "../../../components/BusCart/BusCart";

const BusList = ({ items }) => {
  return (
    <div className="grid md:grid-cols-3 gap-20 mt-12 mx-auto">
      {items?.map((item) => (
        <BusCart key={item?._id} item={item}></BusCart>
      ))}
    </div>
  );
};

export default BusList;
