const express=require( 'express' )
const postController=require( '../Controller/postController' )
const middleware=require( '../Middleware/authentication' )
const postapiRouter=express.Router();



postapiRouter.post( '/post', middleware.verifyToken, postController.userPost )
postapiRouter.get( '/all', middleware.verifyToken, postController.geloginUserPost )
postapiRouter.get( '/allUserspost', middleware.verifyToken, postController.allUserPost )
postapiRouter.delete( '/delPost/:id', middleware.verifyToken, postController.deleteUserPost )
postapiRouter.get( '/displayFrndPost', middleware.verifyToken, postController.showonlyFriendsPost )

module.exports=postapiRouter