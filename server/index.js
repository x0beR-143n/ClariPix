// index.js
import express from "express";
import cors from "cors";
import swaggerDocs from "./swagger.js";
import sequelize from "./database/db.js";
import setupAssociations from "./database/associations.js";
import mainRouter from "./routes/main.routes.js";
import authRoutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/image.routes.js";
import userRoutes from "./routes/user.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3618;

app.use(express.json());
app.use(
    cors({
        origin: "*", // Cho phép tất cả (để test), sau này thay bằng domain frontend thật
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

// Routes
app.use("/", mainRouter);
app.use("/auth", authRoutes);
app.use("/images", imageRoutes);
app.use("/users", userRoutes);
app.use('/collections', collectionRoutes);

// Swagger (⚠️ thêm trước app.listen)
swaggerDocs(app);

// Error handler (đặt cuối cùng)
app.use(errorHandler);

// --- Start Server ---
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to PostgreSQL");

        setupAssociations();

        await sequelize.sync({alter: true});
        console.log("✅ Models synced");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
};

startServer();
