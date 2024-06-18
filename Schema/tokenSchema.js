const mongoose=require( 'mongoose' );
const Schema=mongoose.Schema;

const tokenSchema=new Schema( {
    userId: { type: Schema.Types.ObjectId, ref: 'UserRegDetails', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
} );

module.exports=mongoose.model( 'TokenData', tokenSchema );
