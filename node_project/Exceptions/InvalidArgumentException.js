

class InvalidArgumentException extends Error {
    constructor(m) {
        super(m);
    }
}

module.exports = InvalidArgumentException;