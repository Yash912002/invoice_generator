import { Document, model, Schema, type ObjectId } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
	_id: ObjectId;
	name: string;
	email: string;
	password: string;
	businessName: string;
	address: string;
	phone: string;
	matchPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},
		businessName: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			default: "",
		},
		phone: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

// Password hashing middlware
userSchema.pre("save", async function (next) {
	if (!this.isModified(this.password)) return next();

	const hashedPassword = await bcrypt.hash(this.password, 10);
	this.password = hashedPassword;
	next();
});

userSchema.methods.matchPassword = async function (
	// this: IUser,
	password: string
): Promise<boolean> {
	// Ensure this.password is defined
	if (!this.password) {
		throw new Error(
			"Password is not available in the document. Ensure it is selected."
		);
	}

	return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
