import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import ApartmentStack from "./ApartmentStack";

const MainNavigation = (props) => {
  return (
    <NavigationContainer>
      <ApartmentStack></ApartmentStack>
    </NavigationContainer>
  );
};

export default MainNavigation;
