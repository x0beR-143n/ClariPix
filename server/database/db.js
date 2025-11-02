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

// 2. Định nghĩa các Models (Tables)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    avatar_url: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
}, {
    timestamps: false, // Tắt 'createdAt' và 'updatedAt' tự động của Sequelize
    tableName: 'users',
});

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    uploader_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    safe_score: {
        type: DataTypes.REAL, // Kiểu 'real' trong SQL
    },
    risk_level: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
    },
    adult_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    violence_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    racy_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
    total_views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    total_likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'public', 'quarantined', 'removed'),
        defaultValue: 'pending',
    },
}, {
    timestamps: false,
    tableName: 'images',
    indexes: [ // Thêm index như trong schema
        { fields: ['uploader_id'] }
    ]
});

const Collection = sequelize.define('Collection', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
}, {
    timestamps: false,
    tableName: 'collections',
    indexes: [
        { fields: ['user_id'] }
    ]
});

const Flag = sequelize.define('Flag', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    image_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
    },
    safe_score: {
        type: DataTypes.REAL,
    },
    adult_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    violence_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    racy_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    action_taken: {
        type: DataTypes.ENUM('none', 'auto_quarantine', 'auto_remove', 'manual_review'),
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
}, {
    timestamps: false,
    tableName: 'flags',
    indexes: [
        { fields: ['image_id'] }
    ]
});

// Bảng CollectionImages (Bảng nối Many-to-Many)
// Sequelize sẽ tự tạo bảng này khi dùng 'belongsToMany'
// Chúng ta không cần định nghĩa model cho nó trừ khi có thêm cột (ví dụ: 'added_at')
// Tuy nhiên, để bám sát schema, chúng ta sẽ định nghĩa nó rõ ràng
const CollectionImage = sequelize.define('CollectionImage', {
    collection_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    image_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
}, {
    timestamps: false,
    tableName: 'collection_images',
});


// 3. Định nghĩa các mối quan hệ (Associations)

// User <-> Image (One-to-Many)
User.hasMany(Image, { foreignKey: 'uploader_id', as: 'images' });
Image.belongsTo(User, { foreignKey: 'uploader_id', as: 'uploader' });

// User <-> Collection (One-to-Many)
User.hasMany(Collection, { foreignKey: 'user_id', as: 'collections' });
Collection.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Image <-> Flag (One-to-Many)
Image.hasMany(Flag, { foreignKey: 'image_id', as: 'flags' });
Flag.belongsTo(Image, { foreignKey: 'image_id', as: 'image' });

// Collection <-> Image (Many-to-Many)
Collection.belongsToMany(Image, {
    through: CollectionImage, // Bảng nối
    foreignKey: 'collection_id',
    as: 'images',
});
Image.belongsToMany(Collection, {
    through: CollectionImage, // Bảng nối
    foreignKey: 'image_id',
    as: 'collections',
});

// 4. Export mọi thứ
module.exports = {
    sequelize,
    User,
    Image,
    Collection,
    Flag,
    CollectionImage,
};