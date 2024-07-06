const mongodb=require( '../Schema/userData' )
const bcrypt=require( 'bcrypt' )
const jwt=require( 'jsonwebtoken' )
const tokenData=require( '../Schema/tokenSchema' );
const tokenSchema=require( '../Schema/tokenSchema' );
const saltRounds=10;

// const userRegister=async ( req, res ) => {
//     const { name, email, password }=req.body;
//     const salt=bcrypt.genSaltSync( saltRounds );
//     // const hash=bcrypt.hashSync( password, salt );
//     const regDetails=new mongodb( {
//         username: name, email, password: bcrypt.hashSync( password, salt )
//     } )
//     try {
//         await regDetails.save();

//         res.send( 'Successfully Added to DB' )
//     } catch ( err ) {
//         console.log( err )
//         res.status( 500 ).send( 'Internal Server error' )
//     }
// }

const userRegister=async ( req, res ) => {
    const { name, email, password }=req.body;

    try {
        const salt=bcrypt.genSaltSync( saltRounds );
        const hashedPassword=bcrypt.hashSync( password, salt );

        const regDetails=new mongodb( {
            username: name,
            email,
            password: hashedPassword
        } );

        await regDetails.save();
        res.send( 'Successfully Added to DB' );
    } catch ( err ) {
        console.error( 'Error registering user:', err );
        res.status( 500 ).send( 'Internal Server error' );
    }
};

const userLogin=async ( req, res ) => {
    const { email, password }=req.body;
    //const hashpassword=bcrypt.compareSync( myPlaintextPassword, hash ); // true
    try {
        const userDb=await mongodb.findOne( { email: email } ).exec(); // Assuming 'email' is the email address you're searching for
        //console.log( userDb.password )
        if ( !userDb ) {
            console.log( 'user Not found' )
            return res.status( 404 ).send( 'user Not found in DB' )
        }
        // console.log( userDb )
        const isValidPassword=bcrypt.compareSync( password, userDb.password ); // true
        if ( !isValidPassword ) {
            console.log( 'Password incorrect' )
            return res.status( 401 ).send( "Invalid Password" )
        }
        req.session.userSession={ Userid: userDb._id, name: userDb.email } //used to store session ID in userSession in req.session
        const token=jwt.sign( { email }, "thisisjwtSecret", { expiresIn: '1hr' } )

        const expiration=new Date( Date.now()+3600*1000 );
        const tokenDocument=new tokenData( {
            token,
            expiresAt: expiration,
            userId: userDb._id
        } )
        await tokenDocument.save();
        console.log( token )
        console.log( tokenData )

        //console.log( req.session )
        // console.log("User Logg")
        //    const userNameDB = await mongodb.findOne( { email: email } ).exec();
        // console.log( userDb.email )
        // return res.send( { message: "User Logged In Successfully", username: userDb.email } );
        return res.send( { message: "User Logged In Successfully", username: userDb.email, token: token } );

    } catch ( err ) {
        console.log( err );
        return res.status( 500 ).send( 'Internal server error in password' )
    }
}

const allUserProfile=async ( req, res ) => {
    try {
        const loggedinUser=req.user.userId;
        console.log( loggedinUser )
        // const ObjectId=require( 'mongoose' ).Types.ObjectId;
        // const loggedinUserId=new ObjectId( loggedinUser );

        const allUsersDb=await mongodb.find( { _id: { $ne: loggedinUser } } ).exec();
        console.log( "Length of all users", allUsersDb.length )
        res.send( allUsersDb )

    } catch {
        res.status( 500 ).send( "Internal Server error while fetching all users" )
    }
}

//const tokenData=require( '../Schema/tokenData' ); // Ensure this path is correct
const logout=async ( req, res ) => {
    const token=req.header( 'Authorization' );

    if ( !token ) {
        return res.status( 400 ).json( { message: "No token provided" } );
    }

    // Remove 'Bearer ' prefix if present
    const tokenWithoutBearer=token.startsWith( 'Bearer ' )? token.slice( 7, token.length ):token;

    try {
        const result=await tokenData.findOneAndDelete( { token: tokenWithoutBearer } );

        if ( !result ) {
            return res.status( 404 ).json( { message: "Token not found" } );
        }

        return res.status( 200 ).json( { message: "Logged out successfully" } );
    } catch ( error ) {
        console.log( "Error logging out", error );
        return res.status( 500 ).send( "Error logging out" );
    }
};


const sessionData=async ( req, res ) => {

    try {
        if ( req.user.userId ) {
            console.log( req.user.userId )
            res.send( req.user.userId );
        } else {
            res.status( 401 ).send( { error: 'Not authenticated' } );
        }

    }
    catch ( error ) {
        res.status( 500 ).send( "Error while fecthing session data from userSession" )
    }

}

module.exports={ userRegister, userLogin, allUserProfile, logout, sessionData }