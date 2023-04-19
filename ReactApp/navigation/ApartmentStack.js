import { createStackNavigator } from "@react-navigation/stack";
import ViewApartmentsScreen from "../screens/Apartments";
import ViewApartmentScreen from "../screens/Apartment";

const StackNav = createStackNavigator();
export default function Stack() {
  return (
    <StackNav.Navigator
      headerShown="none"
      initialRouteName="ViewApartmentsScreen"
    >
      <StackNav.Screen
        name="ViewApartmentsScreen"
        component={ViewApartmentsScreen}
        options={{ headerShown: false, headerMode: false }}
      />

      <StackNav.Screen
        name="ViewApartmentScreen"
        component={ViewApartmentScreen}
        options={{ headerShown: false, headerMode: false }}
      />
    </StackNav.Navigator>
  );
}
