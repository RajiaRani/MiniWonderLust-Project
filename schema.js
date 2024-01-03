const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({}).required(),
});