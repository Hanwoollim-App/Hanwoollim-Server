/*
    change major to majorcode. majorcode to major
*/

const db = require("../models");
const User = db.user;


MAJORtoMAJORCODE = (req, res, next) => {

};

MAJORCODEtoMAJOR = (req, res, next) => {

};

const majorcodeconvert = {
    MAJORtoMAJORCODE: MAJORtoMAJORCODE,
    MAJORCODEtoMAJOR: MAJORCODEtoMAJOR
};

module.exports = majorcodeconvert;