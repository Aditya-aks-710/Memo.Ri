# Use an official Node.js runtime as the base. 'slim' is a smaller version.
FROM node:18-slim

# This is the most important part. It uses the system's package manager (apt-get)
# to install the Chromium browser and all the graphics/font/sound libraries it needs to run.
RUN apt-get update \
    && apt-get install -yq --no-install-recommends \
    chromium \
    libnss3 \
    libnspr4 \
    libasound2 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    lsb-release \
    xdg-utils \
    --fix-missing \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container for your app's files
WORKDIR /usr/src/app

# Copy your package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install your application's dependencies
RUN npm install

# Copy the rest of your backend code into the container
COPY . .

# Tell Puppeteer to use the Chromium binary we just installed via apt-get
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Render web services run on port 10000 by default.
# Replace with your app's port if it's different.
EXPOSE 10000

# The command to run when the container starts.
# This should match your "start" script in package.json.
CMD ["npm", "start"]