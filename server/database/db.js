const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Tải các biến từ file .env

// 1. Khởi tạo kết nối Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Tắt log SQL ra console, bật 'console.log' nếu cần debug
    }
);

// Định nghĩa các mối quan hệ (Associations)

// User <-> Image (One-to-Many)
// User.hasMany(Image, { foreignKey: 'uploader_id', as: 'images' });
// Image.belongsTo(User, { foreignKey: 'uploader_id', as: 'uploader' });
//
// // User <-> Collection (One-to-Many)
// User.hasMany(Collection, { foreignKey: 'user_id', as: 'collections' });
// Collection.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
//
// // Image <-> Flag (One-to-Many)
// Image.hasMany(Flag, { foreignKey: 'image_id', as: 'flags' });
// Flag.belongsTo(Image, { foreignKey: 'image_id', as: 'image' });
//
// // Collection <-> Image (Many-to-Many)
// Collection.belongsToMany(Image, {
//     through: CollectionImage, // Bảng nối
//     foreignKey: 'collection_id',
//     as: 'images',
// });
// Image.belongsToMany(Collection, {
//     through: CollectionImage, // Bảng nối
//     foreignKey: 'image_id',
//     as: 'collections',
// });
//
// // 4. Export mọi thứ
// module.exports = {
//     sequelize,
//     User,
//     Image,
//     Collection,
//     Flag,
//     CollectionImage,
// };