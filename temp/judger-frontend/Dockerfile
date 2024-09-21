# Stage 1: Build the Next.js app
FROM node:16.14.0 AS build

# Create app directory
RUN mkdir -p /app

WORKDIR /app

# Install dependencies
COPY package*.json /app/
RUN npm install

# Copy the rest of the project files
COPY . /app/

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the app using Node.js
FROM node:16.14.0

# Create a directory for the app
WORKDIR /app

# Copy built app from the previous stage
COPY --from=build /app /app

# Expose the Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]

