const showdown = require('showdown');
const markdownController = {
    toHtmlConverter:async(req,res,next)=>{
        try {           
            const converter= new showdown.Converter();            
            const text = '# hello, markdown!';          
            const result = converter.makeHtml(text);
            res.send(result);            
        } catch (error) {
            next(error);
        }
    }
};
module.exports = markdownController;