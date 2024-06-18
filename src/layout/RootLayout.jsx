import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import { Grid, GridItem } from "@chakra-ui/react";
import Leftbar from "../components/navigation/Leftbar";
import Rightbar from "../components/navigation/Rightbar";

function RootLayout() {
  return (
    <>
      <Navbar />
      <Grid
        templateColumns="repeat(10, 1fr)"
        gap={2}
        overflow="hidden"
        bgColor="bgColor.200"
        color="textColor.100"
      >
        <GridItem
          as="aside"
          display={{ base: "none", md: "block" }}
          colSpan={{ md: 2, xl: 2 }}
        >
          <Leftbar />
        </GridItem>

        <GridItem
          as="main"
          colSpan={{ base: 10, md: 5, xl: 5 }}
          h="92vh"
          overflowY="scroll"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "bgColor.500",
              borderRadius: "full",
            },
          }}
        >
          <Outlet />
        </GridItem>

        <GridItem
          display={{ base: "none", md: "block" }}
          colSpan={{ md: 3, xl: 3 }}
        >
          <Rightbar />
        </GridItem>
      </Grid>
    </>
  );
}

export default RootLayout;
