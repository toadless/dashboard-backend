const crypto = require("crypto");

module.exports = function objectHash(obj, alg = "sha256", format = "hex") {
    const hash = crypto.createHash(alg)
    const objectDigest = [...Object.keys(obj), ...Object.values(obj)]
    const nestedObjectDigest = objectDigest.reduce((acc, cur) => {
        return typeof cur === "object" && cur.constructor === Object ? 
            [...acc, objectHash(cur)] : 
            [...acc, cur]
    }, [])
    nestedObjectDigest.map(item => hash.update(item.toString()))
    return hash.digest(format)
}