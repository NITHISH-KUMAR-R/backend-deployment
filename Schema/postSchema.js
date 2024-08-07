// const mongoose=require( 'mongoose' )

// const Schema=mongoose.Schema;

// const usersPostSchema=new Schema( {
//     uid: { type: String, require: true },
//     username: { type: String, require: true, unique: true },
//     messagesList: [{
//         userPost: { type: String },
//         likes: { type: Number, default: 1 }, // Number of likes for this post
//         disLikes: { type: Number, default: 1 },
//         date: { type: Date, default: Date.now }
//     }],

//     date: { type: Date, default: Date.now } // Assuming 'Date' is the field for the creation date
// } )

// module.exports=mongoose.model( 'usersPost', usersPostSchema )


const mongoose=require( 'mongoose' );

const Schema=mongoose.Schema;

const messageSchema=new Schema( {
    userPost: { type: String },
    likes: { type: Number, default: 0 }, // Number of likes for this post
    disLikes: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRegDetails' }], // Array of user IDs who liked
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRegDetails' }] // Array of user IDs who disliked
} );

const usersPostSchema=new Schema( {
    uid: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    messagesList: [messageSchema],
    date: { type: Date, default: Date.now } // Assuming 'Date' is the field for the creation date
} );

module.exports=mongoose.model( 'usersPost', usersPostSchema );
