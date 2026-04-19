# Use Node.js Alpine for a lightweight image (< 10 MB requirement conceptually for project, image will be as small as possible)
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy frontend source and build it
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# Copy backend source
COPY backend/ ./backend/
RUN cd backend && npm install --production

# Final lightweight stage
FROM node:20-alpine

WORKDIR /app

# Copy the built frontend and backend
COPY --from=build /app/frontend/dist ./frontend/dist
COPY --from=build /app/backend ./backend

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run default port
EXPOSE 8080

# Start the Express server
CMD ["node", "backend/server.js"]
