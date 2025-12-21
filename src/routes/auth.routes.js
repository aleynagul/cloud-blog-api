import { Router} from "express";

const router = Router();

//test login endpoint

router.post('/login',(req,res) => {
    res.json ({
        message : 'login endpoint çalışıyor.'
    });
});

export default router;