import mongoose from 'mongoose';

const documentRequirementSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Sənədin adı
  description: { type: String },                    // Qısa açıqlama
  isRequired: { type: Boolean, default: true },     // Məcburi/könüllü
  validationRules: { type: String },                // AI üçün yoxlama qaydaları
  exampleImageUrl: { type: String },                // Nümunə şəkil
});

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String },
    duration: { type: String },                     // "3 iş günü"
    fee: { type: String },                          // "Ödənişsiz" / "5 AZN"
    location: { type: String },                     // "Bütün ASAN mərkəzlər"
    aiContext: { type: String },                    // AI-ə verilən əlavə kontekst
    requiredDocuments: [documentRequirementSchema],
    isActive: { type: Boolean, default: true },
    icon: { type: String, default: '📄' },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
