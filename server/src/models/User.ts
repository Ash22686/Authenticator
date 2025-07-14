import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string; // Optional: For users signing in with Google
  password?: string; // Optional: Not present for Google users
  isVerified: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date; 
  otp?: string;
  otpExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
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
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness for actual values
    },
    password: {
      type: String, // No longer required at the schema level
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
     passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
    otp: String,
    otpExpires: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Pre-save hook to hash password only if it has been modified
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>("User", userSchema);
export default User;
