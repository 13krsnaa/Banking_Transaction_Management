const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

//yha user ka schema bnaya
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true, //ye beech ke gap ko hta dega
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "pasword should be atleast 6 characters long"],
      select: false, //ye db qurey me password ko hta dega jabta query me pass pucha na ho
    },
  },
  {
    timestamps: true, // ye user ka create hua or kab update hua uska time aa jata hai
  },
);

// user jab save krega to to ye function run hoga , ye password ko hash krne ke liye use hoga

userSchema.pre("save", async function () {
  //agar pass modify nhi hai to yhi se return ho jaoge
  if (!this.isModified("password")) {
    return next();
  }

  //agar pass modified , then hash krenge
  const hash = await bcryptjs.hash(this.password, 10);
  this.password = hash;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
