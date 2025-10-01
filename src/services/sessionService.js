const sessionModel = require("../models/sessionModel");

exports.getAll = async () => {
  return await sessionModel.findAll();
};

exports.create = async (sessionData) => {
  return await sessionModel.insert(sessionData);
};
