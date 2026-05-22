const SELECTED_PARKING_LOT_ID_KEY = "selectedParkingLotId";

export const getSelectedParkingLotId = () => {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem(SELECTED_PARKING_LOT_ID_KEY);
};

export const setSelectedParkingLotId = (parkingLotId: string) => {
  sessionStorage.setItem(SELECTED_PARKING_LOT_ID_KEY, parkingLotId);
};

export const clearSelectedParkingLotId = () => {
  sessionStorage.removeItem(SELECTED_PARKING_LOT_ID_KEY);
};
