const express=require( 'express' );
const userController=require( '../Controller/userAuthController' )
const userReqController=require( '../Controller/userReqController' )
const middleware=require( '../Middleware/authentication' )


const apiRoute=express.Router();

apiRoute.post( '/newUserReg', userController.userRegister )
apiRoute.post( '/login', userController.userLogin )
apiRoute.get( "/all", middleware.verifyToken, userController.allUserProfile )

apiRoute.post( '/logout', userController.logout )

apiRoute.get( '/', middleware.verifyToken, userReqController.userProfile )
apiRoute.get( '/session', middleware.verifyToken, userController.sessionData )
module.exports=apiRoute