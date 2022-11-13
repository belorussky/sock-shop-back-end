
FROM node:16-alpine As development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm install && npm cache clean --force

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

EXPOSE 3001
# Start the server using the production build
CMD [ "npm", "run", "start" ]
