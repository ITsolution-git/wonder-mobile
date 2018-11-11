import { Linking, Alert } from "react-native";

const AMAZON_BASE_URL = "http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=";

const search = async (query: string): Promise<void> => {
  try {
    const url = AMAZON_BASE_URL + encodeURIComponent(query)
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert("Cannot open Amazon", error);
  }
};

const AmazonService = {
  search
};

export default AmazonService;
