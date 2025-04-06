# Stevens Flood Advisory System 2

The Stevens Flood Advisory System uses data and modeling algorithms various government agencies, to report current and predicted water levels to monitor coastal flooding. The current site was built more than 20 years ago, and is no longer very usable. We have developed a new interface that clean, responsive, and comprehensible to the average person, while also maintaining the same level of detail.

## Getting Started

To run SFAS2 on your local system, follow these steps. `node`, `npm`, and `python`/`python3` need to be installed on your system.

Note that you will need to set up a Google Cloud Console project with the Maps JavaScript API enabled. This is necessary to get an API key for Google Maps. Setting up a Google Cloud Console project requires payment information, but running this project locally will not reasonably surpass any usage quotas.

1. Install dependencies with `npm install`

2. Include the Google Maps JavaScript API Key as an environment variable. For example, in a `.env` file:

```sh
# .env
GOOGLE_MAPS_API_KEY=api_key_here
```

2. Start the development server with `npm run dev`

3. Unzip the `misc/sfas2-test-server.zip` file into a separate directory, install the dependencies, and start the server. This is necessary to get real-time station data when running SFAS2 on your local system

```sh
unzip sfas2-test-server.zip
cd sfas2-test-server

npm install
npm start # start test server
```

## Deploying to `flood.dl.stevens-tech.edu`

We have been using a NUC to simulate a production-ready environment for SFAS2. This NUC runs a web server, which hosts SFAS2 at [`flood.dl.stevens-tech.edu`](https://flood.dl.stevens-tech.edu). Currently, the site can only be accessed when on Stevens' networks.

Below are instructions on how to build and deploy SFAS2 for `flood.dl.stevens-tech.edu`.

TODO: I will finish this when I can access the NUC at school
