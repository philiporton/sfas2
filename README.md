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

We have been using a NUC to simulate a production-ready environment for SFAS2. This NUC runs a web server, which hosts SFAS2 at [`flood.dl.stevens-tech.edu`](https://flood.dl.stevens-tech.edu). Currently, the site can only be accessed when on Stevens' networks. The NUC can only be accessed by `ssh` when using a Stevens VPN.

Below are instructions on how to build and deploy SFAS2 for `flood.dl.stevens-tech.edu`.

1. Copy the following files and directories using `scp` on your host system:

```sh
scp get_sfas_stations.py nyhops@flood.dl.stevens-tech.edu:/home/nyhops
scp -r sfas2 nyhops@flood.dl.stevens-tech.edu:/home/nyhops
scp .env nyhops@flood.dl.stevens-tech.edu:/home/nyhops/sfas2
```

Replace any paths to these files/directories with ones that correspond to your host system. `scp` should work on Windows hosts.

2. Access the NUC by running `ssh nyhops@flood.dl.stevens-tech.edu`. Enter your password when prompted

**NOTE**: If `/www/cgi-bin/get_sfas_stations.py` already exists, you can skip steps 3 and 4. Go to step 5.

3. Change the permissions for `get_sfas_stations.py`:

```sh
# ~/
chmod 755 get_sfas_stations.py
```

4. Copy `get_sfas_stations.py` to the web server:

```sh
# ~/
cp -p get_sfas_stations.py /www/cgi-bin/
```

5. Build SFAS2 for production. If needed, reinstall NPM dependencies:

```sh
# ~/
cd sfas2

# ~/sfas2/
npm ci # for clean install or, npm install
npm run build
```

A successful build should have output similar to the following, and should produce a folder named `dist` inside of the project root:

```
> sfas2@0.1.0 build
> next build

   ▲ Next.js 15.2.4
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces    
 ✓ Exporting (3/3)
 ✓ Finalizing page optimization 

Route (app)                                 Size  First Load JS    
┌ ○ /                                    35.3 kB         180 kB
├ ○ /_not-found                            977 B         109 kB
├ ○ /registration                        2.74 kB         123 kB
└ ○ /stations                            6.07 kB         120 kB
+ First Load JS shared by all             108 kB
  ├ chunks/451-4a937f911010c7b3.js         46 kB
  ├ chunks/f5e865f6-cb0896c280ab112d.js  60.1 kB
  └ other shared chunks (total)          1.91 kB


○  (Static)  prerendered as static content
```

6. Copy the contents of `dist` to the web server:

```sh
# ~/sfas2/
cp -pr dist/* /www/html/
```

SFAS2 should now be available via [`flood.dl.stevens-tech.edu`](https://flood.dl.stevens-tech.edu).
