import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import ApartmentService from "../services/apartment";

export default function ViewApartmentScreen({ route, navigation }) {
  const id = route.params.params.id;
  const [apartment, setApartment] = useState({});
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
      <View>
        <Text>Name : {apartment.name}</Text>
        <Text>Description : {apartment.description}</Text>
        <Text>Price : {apartment.price}</Text>
        <Text>Location : {apartment.location}</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
