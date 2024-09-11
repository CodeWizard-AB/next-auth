import mongoose from "mongoose";


const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URL as string);
		console.log("MongoDb connected");
	} catch (error) {
		console.log(error.message);
	}
};

export default dbConnection;
