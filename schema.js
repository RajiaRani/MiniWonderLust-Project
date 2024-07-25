
// Joi is used to validate a schema
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.string().required(),
        category: Joi.string().valid('mountains', 'rooms', 'trending', 'castles', 'arctic', 'iconic cities', 'camping', 'amazing views', 'farms', 'lakefront', 'beach', 'amazing pools').required()
    }).required()
});

// module.exports = listingSchema;

//Review side validation
module.exports.reviewSchema = Joi.object({
    reviews: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});