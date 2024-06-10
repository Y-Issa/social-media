import { extendTheme } from "@chakra-ui/react";

const alert = {
  variants: {
    solid: () => {
      return {
        container: {
          bg: "primary.400",
        },
      };
    },
    "left-accent": () => {
      return {
        container: {
          borderLeft: "6px solid",
          borderColor: "red.600",
          bg: "red.50",
          color: "red.600",
        },
      };
    },
  },
};

const lightColors = {
  primary: {
    50: "#e3f9f2",
    100: "#c6f0e1",
    200: "#a9e6cf",
    300: "#8cddbe",
    400: "#6fd4ad",
    500: "#52cb9b",
    600: "#3dbb85",
    700: "#28f699",
    800: "#15c182",
    900: "#128d6b",
  },
  bgColor: {
    50: "#ffffff",
    100: "#f8f9fa",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
  textColor: {
    50: "#212529",
    100: "#343a40",
    200: "#495057",
    300: "#6c757d",
    400: "#adb5bd",
    500: "#ced4da",
    600: "#dee2e6",
    700: "#e9ecef",
    800: "#f8f9fa",
    900: "#ffffff",
  },
};

const darkColors = {
  primary: {
    50: "#c8dedb",
    100: "#97bdb5",
    200: "#679c8f",
    300: "#376c69",
    400: "#06413a",
    500: "#08302e",
    600: "#03594a",
    700: "#062622",
    800: "#031410",
    900: "#010b08",
  },
  bgColor: {
    50: "#121212",
    100: "#1d1d1d",
    200: "#2c2c2c",
    300: "#383838",
    400: "#424242",
    500: "#616161",
    600: "#757575",
    700: "#9e9e9e",
    800: "#bdbdbd",
    900: "#e0e0e0",
  },
  textColor: {
    50: "#ffffff",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
};

export const theme_light = extendTheme({
  components: {
    Alert: alert,
  },
  colors: lightColors,
});

export const theme_dark = extendTheme({
  components: {
    Alert: alert,
  },
  colors: darkColors,
});
