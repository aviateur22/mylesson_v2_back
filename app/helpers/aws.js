const { S3 } = require('aws-sdk');
const  aws = require ('aws-sdk');
const  fs = require('fs');

const  s3 = new  aws.S3({
    region:process.env.AWS_BUCKET_REGION,
    accessKeyId:  process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY
});

/**
 * upload un fichier dans le compartiment S3 AWS
 * @param {*} file 
 * @returns 
 */
exports.BucketUploadFile = async(file)=>{
    try {
        const  fileStream = fs.createReadStream(file.path);
        const  param={
            Bucket:process.env.AWS_BUCKET_NAME,
            Body:fileStream,
            Key:file.filename
        };
        return  s3.upload(param).promise();
    }
    catch (err){
        console.log(err);
        return { errorMessage: err};
    }
};

exports.BucketDeleteFile = async()=>{

},

exports.BucketDownloadFile = async(fileKey) =>{
    const  params = {
        Key: fileKey, 
        Bucket: process.env.AWS_BUCKET_NAME        
    };
    return s3.getObject(params).createReadStream();
};