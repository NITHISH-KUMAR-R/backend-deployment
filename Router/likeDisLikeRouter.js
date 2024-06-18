const express=require( 'express' );
const likeCOntroller=require( '../Controller/postLikesDislikes' );
const middleware=require( '../Middleware/authentication' )
const { verifySession }=require( '../Middleware/authentication' );

const likesRouter=express.Router();
likesRouter.post( '/likes/:pid', middleware.verifyToken, likeCOntroller.like )
likesRouter.post( '/dislike/:pid', middleware.verifyToken, likeCOntroller.dislike )

module.exports=likesRouter