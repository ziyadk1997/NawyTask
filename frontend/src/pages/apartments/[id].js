export const getStaticPaths = async () => {
  const res = await fetch("http://localhost:8100/api/apartment/getApartments");
  const data = await res.json();

  const paths = data.map((apartment) => {
    return {
      params: { id: apartment._id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await fetch(
    "http://localhost:8100/api/apartment/getApartments/" + id
  );
  const data = await res.json();
  return {
    props: { apartment: data },
  };
};

const Apartment = ({ apartment }) => {
  return (
    <div>
      <h2>Apartment Details</h2>
      <div>
        <h3>Name : {apartment.name}</h3>
        <h3>Description : {apartment.description}</h3>
        <h3>Price : {apartment.price}</h3>
        <h3>Location : {apartment.location}</h3>
      </div>
    </div>
  );
};
export default Apartment;
