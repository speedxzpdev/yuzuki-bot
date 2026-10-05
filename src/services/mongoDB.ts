import mongoose from "mongoose";



export async function startMongoose() {
    mongoose.connection.on("connecting", () => {
        console.log("MongoDB is ready...");
    });

    mongoose.connection.on("connected", () => {
        console.log("MongoDB is connected!");
    });

    mongoose.connection.on("disconnected", (reason) => {
        console.log("MongoDB is disconnected. Reason:", reason);
    });

    mongoose.connection.on("error", (err) => {
        console.log("MongoDB error!!!");
        console.log(err);
    });

    await mongoose.connect(process.env.DATABASE_URI!);
}