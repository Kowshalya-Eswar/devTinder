const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    status: {
        type: String,
        enum: {
          values: ["ignored","interested","accepted","rejected"],
          message: `{VALUE} is not supported`
        },
        required:true
    },
},
{
    timestamps:true,
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre('save',function (next) {
   if(this.fromUserId.toString()  === this.toUserId.toString() ) {
      throw new Error("cant send connection to yourself");
   }
   next();
})

const ConnectionRequest1  = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest1;
