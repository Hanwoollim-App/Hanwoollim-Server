/*
    return contents
*/

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.chairmanBoard = (req, res) => {
    res.status(200).send("Chairman Content.");
};