const usersPodtModel=require( '../Schema/postSchema' );

const like=async ( req, res ) => {
    const postId=req.params.pid;
    const userId=req.user.userId;
    console.log( "liked user Id", userId )

    try {
        const postWithMatchingId=await usersPodtModel.findOne( { "messagesList._id": postId } );

        if ( postWithMatchingId ) {
            const matchingPost=postWithMatchingId.messagesList.find( message => message._id.toString()===postId );

            if ( matchingPost ) {
                if ( matchingPost.likedBy.includes( userId ) ) {
                    // User has already liked the post, remove the like
                    matchingPost.likes--;
                    matchingPost.likedBy.pull( userId );
                } else {
                    // User has not liked the post yet
                    if ( matchingPost.dislikedBy.includes( userId ) ) {
                        // User has disliked the post, remove the dislike
                        matchingPost.disLikes--;
                        matchingPost.dislikedBy.pull( userId );
                    }
                    // Add the like
                    matchingPost.likes++;
                    matchingPost.likedBy.push( userId );
                }

                await postWithMatchingId.save();
                return res.status( 200 ).json( { message: 'Post updated.', post: matchingPost } );
            } else {
                return res.status( 404 ).json( { message: 'Post not found within messagesList.' } );
            }
        } else {
            return res.status( 404 ).json( { message: 'Post not found.' } );
        }
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).send( "Internal Server Error while Liking Post" );
    }
};

const dislike=async ( req, res ) => {
    const postId=req.params.pid;
    const userId=req.user.userId;

    try {
        const postWithMatchingId=await usersPodtModel.findOne( { "messagesList._id": postId } );

        if ( postWithMatchingId ) {
            const matchingPost=postWithMatchingId.messagesList.find( message => message._id.toString()===postId );

            if ( matchingPost ) {
                if ( matchingPost.dislikedBy.includes( userId ) ) {
                    // User has already disliked the post, remove the dislike
                    matchingPost.disLikes--;
                    matchingPost.dislikedBy.pull( userId );
                } else {
                    // User has not disliked the post yet
                    if ( matchingPost.likedBy.includes( userId ) ) {
                        // User has liked the post, remove the like
                        matchingPost.likes--;
                        matchingPost.likedBy.pull( userId );
                    }
                    // Add the dislike
                    matchingPost.disLikes++;
                    matchingPost.dislikedBy.push( userId );
                }

                await postWithMatchingId.save();
                return res.status( 200 ).json( { message: 'Post updated.', post: matchingPost } );
            } else {
                return res.status( 404 ).json( { message: 'Post not found within messagesList.' } );
            }
        } else {
            return res.status( 404 ).json( { message: 'Post not found.' } );
        }
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).send( "Internal Server Error while Disliking Post" );
    }
};

module.exports={ like, dislike };
