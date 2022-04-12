const { Thematic } = require('../models/index');
const userRole = require('../helpers/userRole');


const thematicController = {
    /**
     * récuperation de toute les thématiques
     */
    getAllThematic: async(req, res, next)=>{
        const thematics = await Thematic.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        res.status(200).json({
            thematics
        });
    }   

};
module.exports = thematicController;