const sequelize = require('../databases/client');
const {DataTypes, Model} = require('sequelize');
const dayjs = require('dayjs');

class Lesson extends Model{
    /**date de création */
    get formatedCreationDate(){
        return ('crée le : '+ dayjs(this.getDataValue('created_at')).format('DD/MM/YYYY'));
    }

    /**date de derniere modification */
    get formatedUpdateDate(){
        return ('mise à jour le : '+ dayjs(this.getDataValue('updated_at')).format('DD/MM/YYYY'));
    }
}

Lesson.init({

    title : DataTypes.STRING,
    content:DataTypes.STRING,
    slug: DataTypes.STRING,
    summary: DataTypes.STRING,
    admin_request: DataTypes.BOOLEAN
},{
    sequelize,
    tableName:'lesson'
});
module.exports = Lesson;