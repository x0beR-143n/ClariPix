# Dùng Node 20 Alpine cho nhẹ
FROM node:20-alpine

WORKDIR /app

# Copy package và cài dependencies
COPY package*.json ./

# Quan trọng: Cài đặt dependencies (bao gồm cả devDependencies vì bạn cần babel-node nếu chưa build)
# Tuy nhiên, tốt nhất là chạy node thuần.
RUN npm install

# Copy toàn bộ code trong folder server vào image
COPY . .

# Generate Prisma Client (BẮT BUỘC để tránh lỗi khi chạy)
RUN npx prisma generate

# Mở port
ENV PORT=3618
EXPOSE 3618

# CHẠY PRODUCTION: Dùng npm start thay vì dev
CMD ["npm", "start"]