module.exports=(req, res, next)=>{  
    return res.status(404).json({message:'path api not found', redirect:'/', error: true});
};