import { Linking, Alert } from "react-native";

const AMAZON_BASE_URL = "http://www.amazon.com/gp/mas/dl/android?";

interface AmazonParams {
  pickup: "my_location" | string; // &pickup=my_location
  formattedAddress: string; // dropoff[formatted_address]=155%20Broadway%2C%20New%20York%2C%20NY%2C%20USA
  latitude: number; // &dropoff[latitude]=40.709386
  longitude: number; // &dropoff[longitude]=-74.010390
}

const search = async (terms: string): Promise<void> => {
  try {
    const url = [
      AMAZON_BASE_URL,
      's=',
      encodeURIComponent(terms)
    ].join("");

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert("Cannot Open Uber", "We are unable to launch the uber app");
  }
};

const AmazonService = {
  search
};

export default AmazonService;
