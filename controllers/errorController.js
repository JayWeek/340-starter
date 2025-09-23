const errorCon = {};

errorCon.triggerError = async function (req,res,next) {
    throw new Error("Intentional 500 error for testing purposes");
}

module.exports = errorCon