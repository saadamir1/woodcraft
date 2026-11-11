FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# SQLite file lives in /data so a mounted volume can keep orders for the day
ENV DATABASE_URL="file:/data/prod.db"

CMD ["sh", "-c", "mkdir -p /data && npx prisma db push && npm run db:seed && npx next start -p ${PORT:-3000}"]
