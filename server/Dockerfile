# Sử dụng Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies (production only để nhẹ hơn, nhưng nếu cần devDependencies để build babel thì cứ để install thường)
RUN npm install

# Copy toàn bộ source code
COPY . .

# Cloud Run sẽ tự inject biến PORT, nhưng ta cứ EXPOSE để document
ENV PORT=8080
EXPOSE 8080

# Chạy lệnh start (node index.js)
CMD ["npm", "start"]