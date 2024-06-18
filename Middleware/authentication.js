const tokenData=require( '../Schema/tokenSchema' );
const mongoDb=require( '../Schema/userData' );

const verifySession=async ( req, res, next ) => {
    try {
        if ( !req.session ) {
            return res.status( 401 ).send( "Please login, no session exists" );
        }
        if ( !req.session.userSession||!req.session.userSession.Userid ) {
            return res.status( 401 ).send( "No session userId  found in session cookie menans cookies cleared from postman" );
        }

        const user_ID=req.session.userSession.Userid;
        console.log( user_ID );

        const userValidation=await mongoDb.findById( user_ID ).exec();
        console.log( userValidation._id );

        if ( !userValidation ) {
            return res.status( 400 ).send( "User not found for this session id" );
        }

        next(); // Call next middleware if everything is fine
    } catch ( err ) {
        console.error( err );
        res.status( 500 ).send( "Internal session server error" );
    }
}
const verifyToken=async ( req, res, next ) => {
    const authHeader=req.header( 'Authorization' );
    console.log( 'Authorization header:', authHeader );

    if ( !authHeader||!authHeader.startsWith( 'Bearer ' ) ) {
        return res.status( 400 ).json( { message: "Invalid authorization header format" } );
    }

    const token=authHeader.substring( 7 ).trim(); // Remove 'Bearer ' prefix and trim whitespace
    console.log( 'Extracted token:', token );

    try {
        const tokenDocument=await tokenData.findOne( { token: token } );
        console.log( 'Token Document from DB:', tokenDocument );

        if ( !tokenDocument ) {
            return res.status( 401 ).json( { message: "Invalid token" } );
        }

        if ( new Date()>tokenDocument.expiresAt ) {
            return res.status( 401 ).json( { message: "Token expired" } );
        }

        // Token is valid, proceed to the next middleware
        req.user={ userId: tokenDocument.userId }; // Attach userId to the request object if needed
        next();
    } catch ( error ) {
        console.log( "Error finding token in database:", error );
        return res.status( 500 ).send( "Error verifying token" );
    }


};

module.exports={ verifySession, verifyToken };