const friendSchema=require( '../Schema/friendSchema' );
const postModel=require( '../Schema/postSchema' )
const userModel=require( '../Schema/userData' );
const { like }=require( './postLikesDislikes' );

const userPost=async ( req, res ) => {
    const user_Id=req.user.userId;
    console.log( user_Id )


    const { postMessage }=req.body;
    console.log( postMessage )
    try {
        const userData=await userModel.findById( user_Id ).exec();
        let postDatabse=await postModel.findOne( { uid: user_Id } ).exec();
        // console.log( postDatabse )
        if ( !postDatabse ) {
            ///console.log( userData )

            postDatabse=new postModel( {
                uid: user_Id,
                username: userData.username,
                messagesList: [{ userPost: postMessage, like: 1, disLikes: 1 }],

            } )
        } else {

            postDatabse.messagesList.push( { userPost: postMessage } );

        }

        await postDatabse.save();
        res.send( "User post saved asuccessfully to the Post DB" )

    } catch ( err ) {
        res.status( 500 ).send( "Internal server error" );

    }
}


const geloginUserPost=async ( req, res ) => {
    const user_ID=req.user.userId;
    try {
        const postDatabse=await postModel.findOne( { uid: user_ID } ).exec();
        console.log( postDatabse )
        const usersAllPost=postDatabse.messagesList.map( p => p.userPost )
        console.log( usersAllPost )
        res.json( postDatabse )



    } catch ( err ) {
        res.status( 500 ).send( "Internal Server Error" )

    }
}

// const allUserPost=async ( req, res ) => {
//     console.log( "hello" )
//     try {
//         const postDatabse=await postModel.find().exec();
//         const messages=postDatabse.map( p => p.messagesList ).flat()
//         messages.forEach( post => {
//             console.log( "User Post:", post.userPost );
//             console.log( "_id:", post._id );
//             // Do whatever you need with the post datas
//         } );

//         //console.log( messages )
//         res.send( messages )

//     } catch ( err ) {
//         res.status( 500 ).send( "Internal Server Error" )
//     }
// }
const allUserPost=async ( req, res ) => {

    try {
        const postDatabase=await postModel.find().exec();
        res.send( postDatabase ); // Sending the entire post array
    } catch ( err ) {
        res.status( 500 ).send( "Internal Server Error" );
    }
};


const deleteUserPost=async ( req, res ) => {
    const postId=req.params.id; // Assuming postId is passed as a URL parameter

    try {
        console.log( postId )
        // Find the post by postId and remove it from messagesList
        const post=await postModel.findOneAndUpdate(
            { 'messagesList._id': postId }, // Find the post with this specific messageId
            { $pull: { messagesList: { _id: postId } } }, // Pull the specific message from messagesList
            { new: true } // Return the updated document
        );

        if ( !post ) {
            return res.status( 404 ).send( "Post not found" );
        }

        res.status( 200 ).send( "Post deleted successfully" );
    } catch ( err ) {
        console.error( err );
        res.status( 500 ).send( "Internal Server Error" );
    }
};

const showonlyFriendsPost=async ( req, res ) => {
    const userId=req.user.userId; // Assuming this is the logged-in user's ID
    console.log( userId )
    try {
        // Find the document in friendSchema where userid matches the logged-in user's ID
        const friendData=await friendSchema.findOne( { userid: userId } );

        if ( !friendData ) {
            return res.status( 404 ).json( { message: "Friend data not found" } );
        }

        // Extract friend names from the friendList array
        const friendNames=friendData.friendList.map( friend => friend.fName );

        // Now you have an array of friend names (`friendNames`), you can use this data as needed

        // Example: Fetch posts from postModel where user_id is in the friend list
        const friendPosts=await postModel.find( { username: { $in: friendNames } } );

        // Return response with friend posts or perform other operations
        return res.status( 200 ).json( { friendPosts } );

    } catch ( error ) {
        console.error( 'Error fetching friends data:', error );
        return res.status( 500 ).json( { message: "Server error" } );
    }
};




module.exports={ userPost, geloginUserPost, allUserPost, deleteUserPost, showonlyFriendsPost }