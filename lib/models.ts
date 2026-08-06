import mongoose, { Schema, Document } from 'mongoose';

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

// Settings Schema
const settingsSchema = new Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  gstNumber: { type: String },
  footerText: { type: String },
  signatureUrl: { type: String },
  currencySymbol: { type: String, default: '₹' }
});

// Client Schema
const clientSchema = new Schema({
  name: { type: String, required: true },
  companyName: { type: String },
  email: { type: String },
  phone: { type: String, required: true },
  altPhone: { type: String },
  gstNumber: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Product Item (Embedded Schema)
const productItemSchema = new Schema({
  type: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  quantity: { type: Number, required: true },
  glassType: { type: String },
  frameColor: { type: String },
  hardware: { type: String },
  remarks: { type: String },
  unitPrice: { type: Number, default: 0 }
});

// Project Schema
const projectSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  projectName: { type: String, required: true },
  projectDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  totalAmount: { type: Number, required: true, default: 0 },
  discountPercent: { type: Number, default: 0 },
  taxPercent: { type: Number, default: 8 },
  totalArea: { type: Number, default: 0 },
  ratePerSqFt: { type: Number, default: 500 },
  products: [productItemSchema],
  createdAt: { type: Date, default: Date.now }
});

// Submission Schema
const submissionSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Check if models exist before creating them to avoid Next.js hot reload overwrite errors
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
