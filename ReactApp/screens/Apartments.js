import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import ApartmentService from "../services/apartment";

export default function ViewApartmentsScreen({ route, navigation }) {
  const [data, setApartments] = useState([]);
  useEffect(() => {
    ApartmentService.getApartments()
      .then((res) => {
        setApartments(res.data);
      })
      .catch((e) => {
        alert("Could not fetch Apartments");
      });
  }, []);
  function viewApartment(apartment) {
    navigation.navigate("ViewApartmentScreen", {
      params: { id: apartment._id },
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Apartments</Text>
        {data.map((apartment) => (
          <Pressable
            key={apartment._id}
            onPress={() => viewApartment(apartment)}
          >
            <Text style={{ fontSize: 30 }}>{apartment.name}</Text>
          </Pressable>
        ))}
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
