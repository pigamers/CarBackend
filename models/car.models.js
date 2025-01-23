const mongoose = require("mongoose");

const CarDetailsSchema = mongoose.Schema(
  {
    // Owner Information
    OwnerName: {
      type: String,
      required: true,
    },
    OwnerContact: {
      type: Number,
      required: true,
      unique: true,
    },
    OwnerAddress: {
      type: String,
      required: true,
    },
    OwnerEmail: {
      type: String,
      required: true,
      unique: true,
    },

    // Car Information
    MakeOfCar: {
      type: String,
      required: true,
    },
    Model: {
      type: String,
      required: true,
    },
    Year: {
      type: Number,
      required: true,
    },
    Mileage: {
      type: Number,
      required: true,
    },
    Color: {
      type: String,
      required: true,
    },

    // Car Condition
    Condition: {
      type: String, // Could be values like 'New', 'Used', etc.
      required: true,
    },
    AccidentHistory: {
      type: String, // Text or Boolean can be used to indicate the accident history
      required: true,
    },
    ServiceHistory: {
      type: String, // Details about service history
      required: true,
    },
    InsuranceStatus: {
      type: String, // Whether the car is insured or not
      required: true,
    },
    TaxUptill: {
      type: Date, // Date format for tax validity
      required: true,
    },

    // Car Photos
    FrontView: {
      type: String, // Image URL for the front view
      required: false, // Optional
    },
    BackView: {
      type: String, // Image URL for the back view
      required: false, // Optional
    },
    RearSideView1: {
      type: String, // Image URL for the first rear side view
      required: false, // Optional
    },
    RearSideView2: {
      type: String, // Image URL for the second rear side view
      required: false, // Optional
    },
    ExteriorVideo: {
      type: String, // URL of the uploaded video
      required: false, // Optional
    },
  },
  {
    timestamps: true, // To store createdAt and updatedAt
  }
);

module.exports = mongoose.model("CarDetails", CarDetailsSchema);
