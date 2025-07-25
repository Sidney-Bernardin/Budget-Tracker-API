import pg from "pg"


const client = new pg.Client(process.env.POSTGRES_URL)
await client.connect()


export default { client }
