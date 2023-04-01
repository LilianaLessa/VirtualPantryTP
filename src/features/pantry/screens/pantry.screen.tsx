import React from "react";
import PantryList from "../components/pantry-list.component";
import { createMockPantry } from "../../../dev-utils";

function PantryScreen() {
  const pantries = [createMockPantry(), createMockPantry(), createMockPantry()];

  return <PantryList pantries={pantries} />;
}

export default PantryScreen;
