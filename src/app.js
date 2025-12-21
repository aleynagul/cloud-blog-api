import express from 'express';
import authRouters from './routes/auth.routes.js';
import postRouters from './routes/post.routes.js';

const app = express();

//middleware
app.use(express.json());

//test endpoit
app.get('/',(req,res) => {
    res.send('Blog api çalışıyor.');
});

//routers
app.use('/auth',authRouters);
app.use('/post',postRouters);

export default app;
