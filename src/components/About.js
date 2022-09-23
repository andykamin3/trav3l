import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

export function About() {
  return <Stack spacing={2}>
    <Typography variant={"h3"}>About</Typography>
    <Divider/>
    <Typography variant={"h5"}>Our mission</Typography>
    <Typography variant={"body1"}>At trav3l we work to connect digital nomads and tourists with local communities. We
      believe that the best way to experience a new place is to connect with the people who live there. We want to make
      it easy to find unique spots and experiences about your next adventure.</Typography>
    <Typography variant={"body1"}>We want to reward those who are willing to share their knowledge. This is why we built
      trav3l using Lens Protocol so that trav3llers can collect the posts that helped them and reward their
      creators. </Typography>
    <Typography variant={"body1"}>Through trav3l DAO we want to keep rewarding users and encourage the creation of
      content. Learn more on the trav3lDAO tab. </Typography>
    <Divider/>
    <Typography variant={"h5"}>Our team</Typography>
    <Typography variant={"body1"}>We are a team of 2 college students from Argentina. We are passionate about travel and
      web3. </Typography>
    <Divider/>
    <Typography variant={"h5"}>Our roadmap</Typography>
    <Typography variant={"body1"}>We are currently working on the MVP of the platform. We have managed to integrate Lens
      to create and display posts in the map. You can also create and visualize events. </Typography>
    <Typography variant={"body1"}>We are also working on the trav3l DAO. We are currently working on the smart contracts
      and the frontend. </Typography>
    <Typography variant={"body1"}>Future improvements and features include:
      <ul>
        <li>UX/UI improvements</li>
        <li>Community building and review sourcing</li>
        <li>Integration with other social networks</li>
        <li>Integration with OpenSEA and token-gated content for creators</li>
        <li>Deployment on Polygon Mainnet</li>
      </ul></Typography>
    <Divider/>
    <Typography variant={"h5"}>Our tech</Typography>
    <Typography variant={"body1"}>We are building trav3l using React, Node.js and Google Maps API. We are using Lens
      Protocol to reward the creators of the posts and using Tableland to store events and allow users to create
      theirs. </Typography>
  </Stack>;
}
