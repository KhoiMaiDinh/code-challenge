# ----------------------
# 1. Base Stage
# ----------------------
FROM node:20-alpine AS base

# ----------------------
# 2. Development Stage
# ----------------------
FROM base AS development
WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

USER node

CMD ["npm", "run", "start:dev"]

# ----------------------
# 3. Builder Stage
# ----------------------
FROM base AS builder
WORKDIR /app


COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/src ./src
COPY --chown=node:node --from=development /app/tsconfig.json ./tsconfig.json

RUN npm run build

# Removes unnecessary packages adn re-install only production dependencies
ENV NODE_ENV=production
RUN npm prune --production
RUN npm install --prod

USER node
# ----------------------
# 4. Production Stage
# ----------------------
FROM node:20-alpine AS production
WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/build ./build
COPY --chown=node:node --from=builder /app/package.json ./

USER node

# Start the server using the Production build
CMD [ "node", "build/app.js" ]
