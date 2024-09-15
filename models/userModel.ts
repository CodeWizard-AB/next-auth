import bcrypt from "bcryptjs";
import { model, models, Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {
	name: string;
	password: string;
	email: string;
	role: "user" | "admin";
	isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: [true, "Name is required"], trim: true },
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [8, "Minimun 8 characters required for password"],
			select: false,
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			validate: [validator.isEmail, "Invalid email address"],
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true }
);

// * DOCUMENT MIDDLEWARE
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

// * INSTANCE METHODS
userSchema.methods.isPasswordCorrect = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

const User = models?.User || model<IUser>("User", userSchema);

export default User;
