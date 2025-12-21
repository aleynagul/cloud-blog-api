import { Router} from "express";
import jwt from 'jsonwebtoken';

const router = Router();

//kullanıcı adı
const USER = {
    username: 'aley',
    password: '1234'
};

const JWT_SECRET = 'supersecretkey';

//test login endpoint

router.post('/login',(req,res) => {
    const {username,password}=req.body;

    if(username !== USER.username || password !==USER.password){
        return res.status(401).json({message: 'geçersiz kullanıcı bilgileri'});
    }
    const token = jwt.sign (
        {username},
        JWT_SECRET,
        {expiresIn: '1h'}
    );
    
    res.json ({ token });
});

export default router;