const express=require( 'express' );
const likeController=require( '../Controller/postLikesDislikes' );
const middleware=require( '../Middleware/authentication' )
const { verifySession }=require( '../Middleware/authentication' );

const likesRouter=express.Router();
console.log( "CAME RO TOURTER" )
likesRouter.post( '/likes/:pid', middleware.verifyToken, likeController.like )
likesRouter.post( '/dislike/:pid', middleware.verifyToken, likeController.dislike )

module.exports=likesRouter