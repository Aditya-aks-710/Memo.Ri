# Use an official Node.js runtime as the base. 'slim' is a smaller, more efficient version.
FROM node:20-slim

# Set the working directory inside the container for your app's files
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first. This leverages Docker's layer caching,
# so dependencies are only re-installed if package.json changes.
COPY package*.json ./

# Install all of your application's dependencies
RUN npm install

# Copy the rest of your backend source code into the container
COPY . .

# Run the build script from your package.json (e.g., "tsc")
# This compiles your TypeScript code into JavaScript in the /dist directory.
RUN npm run build

# Expose the port your application runs on.
# Your logs showed the server running on port 3000.
EXPOSE 3000

# The command to run when the container starts.
# This executes the "start" script from your package.json (e.g., "node dist/index.js").
CMD ["npm", "start"]
