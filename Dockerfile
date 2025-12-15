# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies for both root and backend
RUN npm install
RUN cd backend && npm install

# Copy the rest of the application code
COPY . .

# Build the backend TypeScript code
RUN cd backend && npm run build

# Expose the port the app runs on
EXPOSE $PORT

# Start the backend server
CMD ["node", "backend/dist/server.js"]