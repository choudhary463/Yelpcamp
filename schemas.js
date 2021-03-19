const Joi=require('joi');
module.exports.CampgroundSchema=Joi.object({
    title:Joi.string().required(),
    price:Joi.number().required().min(0),
    description:Joi.string(),
    location:Joi.string().required(),
    deleteImages:Joi.array()
});