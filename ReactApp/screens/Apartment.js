import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import ApartmentService from "../services/apartment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function ViewApartmentScreen({ route, navigation }) {
  const id = route.params.params.id;
  const [apartment, setApartment] = useState({});
  const handleBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    ApartmentService.getApartment(id)
      .then((res) => {
        setApartment(res.data);
      })
      .catch((e) => {
        alert("Could not fetch Product");
      });
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={handleBack} style={styles.btn}>
        <MaterialCommunityIcons name="arrow-left" color={"black"} size={24} />
      </Pressable>
      <Text style={styles.apartment_details_title}>Apartment Details</Text>
      <View>
        <Text style={styles.apartment_details}>Name : {apartment.name}</Text>
        <Text style={styles.apartment_details}>
          Description : {apartment.description}
        </Text>
        <Text style={styles.apartment_details}>Price : {apartment.price}</Text>
        <Text style={styles.apartment_details}>
          Location : {apartment.location}
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  apartment_details_title: {
    color: "blue",
    borderRadius: 10,
    display: "block",
    fontSize: 20,
    margin: 20,
  },
  apartment_details: {
    color: "black",
    borderRadius: 10,
    display: "block",
    fontSize: 15,
    fontFamily: "Nunito",
    margin: 20,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
