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
        templateColumns="repeat(8, 1fr)"
        gap={2}
        overflow="hidden"
        bgColor="bgColor.200"
        color="textColor.100"
      >
        <GridItem
          as="aside"
          display={{ base: "none", md: "block" }}
          colSpan={{ md: 1, xl: 1 }}
        >
          <Leftbar />
        </GridItem>

        <GridItem
          as="main"
          colSpan={{ base: 8, md: 4, xl: 5 }}
          maxH="92vh"
          overflowY="scroll"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.300",
              borderRadius: "full",
            },
          }}
        >
          <Outlet />
        </GridItem>

        <GridItem
          display={{ base: "none", md: "block" }}
          colSpan={{ md: 3, xl: 2 }}
        >
          <Rightbar />
        </GridItem>
      </Grid>
    </>
  );
}

export default RootLayout;
