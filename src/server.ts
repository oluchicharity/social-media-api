import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';
import router from './routes/userRoutes';
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express();
const PORT = process.env.PORT || 2000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Social Media API!');
});

app.use(express.json());

// Define API routes
app.use('/api', router);

// MongoDB connection
const mongodb = 'mongodb+srv://agbakwuruoluchi29:SgsXUJZeUJeWFLNh@cluster0.mhffqbw.mongodb.net/social-media-api';
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//mongodb+srv://agbakwuruoluchi29:<password>@cluster0.mhffqbw.mongodb.net/

//SgsXUJZeUJeWFLNh