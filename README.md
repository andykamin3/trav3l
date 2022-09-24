# trav3l 

![trav3l logo](https://bafkreicyuh6uhxkpmlnje7fggaybmq443two4pdyofr4ze3sux433cokb4.ipfs.nftstorage.link/)
## About trav3l 
trav3l is a web3 application that allows users to share their experiences with others to help them plan their next trip. 

[See a demo](https://trav3l-362116.web.app/).

trav3l right now uses Lens Protocol and Tableland, both deployed on Polygon Mumbai to create a social network for digital nomads and travellers as well as local residents. It strives to be the "TripAdvisor of web3". We intend to leverage Lens's collect feature to allow for creators to be properly rewarded for their content as well as creating token-gated content in the future.

Our app infrastructure, coupled with the proposed trav3lDAO enables users to incentivize creators and distribute grants according to their future trips. It is possible also for conference organizers or companies to sponsor specific creators.

During development we were unable to find a suitable replacement for the Google Maps API that did not depend on a centralized provider. This is also something we intend to work towards building in the future making it composable and enabling other builders to use our map protocol. There's a long road ahead of us.



## Important information
- It is necessary to have a Google Maps API Key to replace in the file `public/index.html` in order to properly use the application. (Not adding a key will show a warning in the map)
- Use a .env file to store the API Key. 
- It is not acceptable to upload the API Key to GitHub, so it is necessary to remove it before publicly committing code. 

## Installation
- Clone the repository
- Install the dependencies with `npm install`
- Run the application with `npm start`
- Open the application in the browser at `localhost:3000`
