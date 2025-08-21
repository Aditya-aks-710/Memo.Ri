# Use an official Node.js runtime as the base.
FROM node:20-slim

# --- OPTIMIZED BROWSER INSTALLATION ---
# 1. Install only the essential dependencies needed for Puppeteer's browser.
# This is a much smaller and faster list than installing the full chromium package.
RUN apt-get update \
    && apt-get install -yq --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install all dependencies
RUN npm install

# 2. Use Puppeteer's command to download a compatible browser.
# This is much faster and more reliable than apt-get.
RUN npx puppeteer browsers install chrome

# Copy the rest of your source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 10000

# The command to run when the container starts.
# We no longer need to set PUPPETEER_EXECUTABLE_PATH because the code
# in the other artifact will handle it automatically.
CMD ["npm", "start"]
