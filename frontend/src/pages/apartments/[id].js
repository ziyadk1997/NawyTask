import styles from "../../styles/apartments.module.css";

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
      <h2 className={styles.apartment_details_title}>Apartment Details</h2>
      <div>
        <p className={styles.apartment_details}>Name : {apartment.name}</p>
        <p className={styles.apartment_details}>
          Description : {apartment.description}
        </p>
        <p className={styles.apartment_details}>Price : {apartment.price}</p>
        <p className={styles.apartment_details}>
          Location : {apartment.location}
        </p>
      </div>
    </div>
  );
};
export default Apartment;
