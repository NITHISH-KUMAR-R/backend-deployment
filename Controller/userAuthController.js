const mongodb=require( '../Schema/userData' );
const bcrypt=require( 'bcryptjs' );
const jwt=require( 'jsonwebtoken' );
const { jwtSecret }=require( '../config' ); // Create a config file to store JWT secret

const userRegister=async ( req, res ) => {
    const { name, email, password }=req.body;
    const salt=bcrypt.genSaltSync( 10 );
    const hashedPassword=bcrypt.hashSync( password, salt );

    const regDetails=new mongodb( {
        username: name,
        email: email,
        password: hashedPassword
    } );

    try {
        await regDetails.save();
        res.send( 'Successfully Added to DB' );
    } catch ( err ) {
        console.log( err );
        res.status( 500 ).send( 'Internal Server error' );
    }
}

const userLogin=async ( req, res ) => {
    const { email, password }=req.body;

    try {
        const userDb=await mongodb.findOne( { email: email } ).exec();

        if ( !userDb ) {
            console.log( 'User not found' );
            return res.status( 404 ).send( 'User not found in DB' );
        }

        const isValidPassword=bcrypt.compareSync( password, userDb.password );

        if ( !isValidPassword ) {
            console.log( 'Password incorrect' );
            return res.status( 401 ).send( 'Invalid Password' );
        }

        // Create JWT token
        const token=jwt.sign( { userId: userDb._id, email: userDb.email }, jwtSecret, { expiresIn: '1h' } );

        return res.json( { message: "User Logged In Successfully", token } );
    } catch ( err ) {
        console.log( err );
        return res.status( 500 ).send( 'Internal server error in password' );
    }
}

const allUserProfile=async ( req, res ) => {
    try {
        const allUsersDb=await mongodb.find().exec();
        console.log( 'Length of all users', allUsersDb.length );
        res.send( allUsersDb );
    } catch ( err ) {
        res.status( 500 ).send( 'Internal Server error while fetching all users' );
    }
}

// Middleware to verify JWT token
const verifyToken=( req, res, next ) => {
    const token=req.headers.authorization?.split( ' ' )[1];

    if ( !token ) {
        return res.status( 401 ).json( { message: 'Unauthorized: No token provided' } );
    }

    jwt.verify( token, jwtSecret, ( err, decoded ) => {
        if ( err ) {
            console.error( 'Failed to authenticate token:', err );
            return res.status( 403 ).json( { message: 'Unauthorized: Failed to authenticate token' } );
        }

        req.user=decoded; // Attach decoded user information to request object
        next();
    } );
}

const logout=async ( req, res ) => {
    // In JWT, logout is client-side. Just discard the token on the client.
    res.send( "User Logout successful" );
}

const sessionData=async ( req, res ) => {
    try {
        // User information is already attached to req.user via verifyToken middleware
        if ( req.user ) {
            res.json( req.user );
        } else {
            res.status( 401 ).json( { error: 'Not authenticated' } );
        }
    } catch ( error ) {
        res.status( 500 ).send( "Error while fetching session data from userSession" );
    }
}

module.exports={ userRegister, userLogin, allUserProfile, verifyToken, logout, sessionData };
