# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Inject build-time environment variables
# These can be overridden at build time using --build-arg
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SMART_USER_API_URL
ARG NEXT_PUBLIC_BACKOFFICE_URL

# Set them as environment variables during build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SMART_USER_API_URL=$NEXT_PUBLIC_SMART_USER_API_URL
ENV NEXT_PUBLIC_BACKOFFICE_URL=$NEXT_PUBLIC_BACKOFFICE_URL

# Build the Next.js app (uses the above env vars)
RUN pnpm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV HUSKY=0

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

EXPOSE 3001
CMD ["pnpm", "start"]
