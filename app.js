import * as server from "./server/server.js"

const port = process.env.PORT || 8000
server.app.listen(port, () => console.log(`Ready. port=${port}`))
