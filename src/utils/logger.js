const logger = require("pino");
const dayjs = require("dayjs");


const log = logger({
    base: {
        pid: false
    },
    timestamp: ()=> `"Time: ${dayjs().format()}"`
})

module.exports = log