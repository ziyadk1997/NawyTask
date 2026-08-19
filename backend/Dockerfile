FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Ensure OpenSSL and build tools are present so Prisma postinstall can fetch engines
RUN apt-get update && \
	apt-get install -y --no-install-recommends openssl ca-certificates build-essential python3 && \
	rm -rf /var/lib/apt/lists/*

# Install dependencies (including dev deps) so we can run prisma generate for the target platform
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
RUN apt-get update && \
	apt-get install -y --no-install-recommends openssl ca-certificates && \
	rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./package.json
ENV NODE_ENV=production
EXPOSE 4000
# Apply any pending migrations before starting the server. `prisma migrate deploy`
# is safe to run on every boot: it's a no-op when the schema is already current,
# and it's the documented way to apply migrations in non-interactive/prod
# environments (unlike `migrate dev`, which is dev-only and requires a TTY).
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
