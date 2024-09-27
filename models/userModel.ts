import bcrypt from "bcryptjs";
import validator from "validator";
import { model, models, Schema } from "mongoose";

interface IUser extends Document {
	name: string;
	password: string;
	email: string;
	image: string;
	role: "user" | "admin";
	emailVerified: boolean;
	twoFactorVerified: boolean;
	authProvider: string;
	isActive: boolean;
	verificationToken: string;
	verificationExpires: Date;
	passwordChangedAt: Date;
	passwordResetToken: string;
	passwordResetExpires: Date;
	twoFactorToken: string;
	twoFactorExpires: Date;
	isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: [true, "Name is required"], trim: true },
		password: {
			type: String,
			minLength: [8, "Minimun 8 characters required for password"],
			select: false,
			trim: true,
			validate: {
				validator(password) {
					if (this.authProvider === "credentials" && !password) return false;
					return true;
				},
				message: "Password is required",
			},
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			validate: [validator.isEmail, "Invalid email address"],
		},
		image: { type: String, default: null },
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		authProvider: { type: String, required: true },
		emailVerified: { type: Boolean, required: true, default: false },
		twoFactorVerified: { type: Boolean, required: true, default: false },
		isActive: {
			type: Boolean,
			default: true,
			select: false,
		},
		verificationToken: String,
		verificationExpires: Date,
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		twoFactorToken: String,
		twoFactorExpires: Date,
	},
	{ timestamps: true }
);

// * ADD Indexes
userSchema.index({ email: 1 });

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
