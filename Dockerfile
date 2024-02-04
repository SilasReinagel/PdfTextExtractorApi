# Use an Ubuntu base image
FROM ubuntu:latest

# Avoid prompts from apt during installation
ARG DEBIAN_FRONTEND=noninteractive

# Update the package list and install dependencies
RUN apt-get update && \
    apt-get install -y poppler-utils imagemagick ghostscript tesseract-ocr \
    curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js (using NodeSource for the latest versions)
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package.json package-lock.json* ./

# Install your app dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem
COPY src ./src

# Expose the port your app runs on
EXPOSE 3005

# Command to run your app
ENTRYPOINT ["node", "src/index.js"]
