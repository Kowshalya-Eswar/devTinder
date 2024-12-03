const adminAuth = (req,res,next) => {
    console.log("Authorization middle ware");
    const token = "abc";
    const isAdminUser = "abc" === token;
    if (isAdminUser) {
        next();
    } else {
        res.status(401).send("unauthorized access");
    }
};

module.exports ={   
     adminAuth,
}