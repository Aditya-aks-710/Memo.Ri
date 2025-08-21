# Use an official Node.js runtime as the base. 'slim' is a smaller version.
FROM node:20-slim

# Install Chromium and its dependencies
RUN apt-get update \
    && apt-get install -yq --no-install-recommends \
    chromium \
    # ... (all the other dependencies from before)
    libnss3 libnspr4 libasound2 libatk-bridge2.0-0 libcups2 libdbus-1-3 libdrm2 libgbm1 libgtk-3-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libxss1 libxtst6 ca-certificates fonts-liberation lsb-release xdg-utils \
    --fix-missing \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies like typescript)
RUN npm install

# Copy the rest of your source code
COPY . .

# --- NEW STEP: Build the TypeScript code ---
# This runs the "build" script from your package.json (i.e., "tsc")
# It will create the /dist directory with your compiled .js files.
RUN npm run build

# Tell Puppeteer to use the Chromium binary we installed
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose the port your app runs on
EXPOSE 10000

# The command to run when the container starts.
# This will now work because the /dist folder exists.
CMD ["npm", "start"]