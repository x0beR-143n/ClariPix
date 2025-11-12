# Step 1: Base image
FROM node:18-alpine

WORKDIR /app

# Step 2: Copy package.json và cài dependencies
COPY package*.json ./
RUN npm install

# Step 3: Copy source code
COPY . .

# Step 4: Build nếu cần (ở đây dùng babel thì có thể build trước)
# RUN npx babel src --out-dir dist || true

# Step 5: Start app
CMD ["npm", "run", "dev"]
