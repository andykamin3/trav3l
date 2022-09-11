import Box from "@mui/material/Box";
import {Paper, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {ButtonLink} from "./ButtonLink";
import * as React from "react";

export function LocationCard(props) {
  const gridItem = {
    margin: "8px",
  }
  return <Box sx={gridItem}>
    <Paper elevation={2}>
      <Box px={2} py={2}>
        <Stack spacing={0.5}>
          <Typography align={"center"} variant={"h6"}>{props.city.name}</Typography>
          <Typography align={"center"} variant={"body2"}>{props.city.country.name}</Typography>
          <Typography variant={"body1"} align={"center"}>
          </Typography>
          <Box textAlign="center">
            <ButtonLink to={"locations/" + props.city.id}>
              See more
            </ButtonLink>
          </Box>
        </Stack>
      </Box>
    </Paper>
  </Box>;
}
