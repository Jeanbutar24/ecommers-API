const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    alamat: [
      {
        jalan: {
          type: String,
          require: true,
        },
        Kelurahan: {
          type: String,
          require: true,
        },
        kecematan: {
          type: String,
          require: true,
        },
        kabupaten: {
          type: String,
          require: true,
        },
        provinsi: {
          type: String,
          require: true,
        },
        negara: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
