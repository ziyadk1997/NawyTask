import styles from "../../styles/apartments.module.css";
import Head from "next/head";
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
      <Head>
        <title>Nawy Task</title>
      </Head>
      <h1 className={styles.title}>All Apartments</h1>
      {apartments.map((apartment) => (
        <div key={apartment.id}>
          <a href={"apartments/" + apartment._id} className={styles.single}>
            <div>{apartment.name}</div>
          </a>
        </div>
      ))}
    </div>
  );
};
export default Apartments;
