"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 2000;
app.get('/', (req, res) => {
    res.send('Welcome to the Social Media API!');
});
app.use(express_1.default.json());
app.use('/api/v1', userRoutes_1.default, postRoutes_1.default);
const mongodb = 'mongodb+srv://agbakwuruoluchi29:SgsXUJZeUJeWFLNh@cluster0.mhffqbw.mongodb.net/social-media-api';
mongoose_1.default.connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//mongodb+srv://agbakwuruoluchi29:<password>@cluster0.mhffqbw.mongodb.net/
//SgsXUJZeUJeWFLNh
