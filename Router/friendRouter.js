const express=require( 'express' );
const friendController=require( '../Controller/friendController' )
const middleware=require( '../Middleware/authentication' )


const friendRoute=express.Router();
console.log( "hello" )

friendRoute.get( '/all', middleware.verifyToken, friendController.displayAllFriends )
// friendRoute.post( '/accept/:id', middleware.verifyToken, friendController.acceptFriendRequest )
friendRoute.post( '/req/:recieverId', middleware.verifyToken, friendController.sendFriendRequest )
// friendRoute.post( '/accFrndreq/:reqId', middleware.verifyToken, friendController.acceptRequestFromSender )
friendRoute.post( '/pending/:reqId', middleware.verifyToken, friendController.acceptFriend )
friendRoute.get( '/recievedReq', middleware.verifyToken, friendController.receivedRequestForLoggedInUser )
friendRoute.get( '/unkownuser', middleware.verifyToken, friendController.showUnknownUsers )

module.exports=friendRoute