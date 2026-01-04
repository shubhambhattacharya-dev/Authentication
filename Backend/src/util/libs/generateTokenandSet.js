import jwt from 'jsonwebtoken'

export const  generateTokenAndSetCookie=(res,userId)=>{
    const token =jwt.sign({id:userId},process.env.JWT_SECRET,{
       expiresIn:"7d" 
    })

    res.cookie("token",token,{
        httpOnly: true,//accessible only by web server , not js , and also documents.cookie and secure from xss attacks . what is xss attack : when attacker injects malicious js code in your website to steal cookies and sensitive data thorugh js 

        sameSite: "strict", // prevent csfr attacks , what is csfr attack : when attacker tricks user to perform actions on your website without your consent by sending requests from another site
        secure: process.env.NODE_ENV === "production",//cookie only sent over https in production
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
}
