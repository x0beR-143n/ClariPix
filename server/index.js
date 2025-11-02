const express = require('express');
const { sequelize, User, Image } = require('./database/db');
const mainRoute = require("./routes/main.routes");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', mainRoute);

// --- Hàm Khởi động Server ---
const startServer = async () => {
    try {
        // 1. Xác thực kết nối DB
        await sequelize.authenticate();
        console.log('✅ Kết nối PostgreSQL thành công!');

        // 2. Đồng bộ models với Database
        // .sync() sẽ tạo các bảng nếu chúng chưa tồn tại
        // (Dùng { force: true } để xóa và tạo lại, hữu ích khi DEV)
        await sequelize.sync();
        // await sequelize.sync({ force: true }); // Cẩn thận: Mất hết dữ liệu
        console.log('✅ Tất cả models đã được đồng bộ hóa.');

        // 3. Khởi động Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Không thể kết nối tới database:', error);
    }
};

startServer();