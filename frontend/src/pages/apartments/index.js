import styles from "../../styles/apartments.module.css";
import Link from "next/link";
export const getStaticProps = async () => {
  const res = await fetch("http://localhost:8100/api/apartment/getApartments");
  const data = await res.json();
  return {
    props: { apartments: data },
  };
};
const Apartments = ({ apartments }) => {
  return (
    <div>
      <h2>All Apartments</h2>
      {apartments.map((apartment) => (
        <div key={apartment.id}>
          <Link href={"apartments/" + apartment._id} className={styles.single}>
            <h3>{apartment.name}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};
export default Apartments;
