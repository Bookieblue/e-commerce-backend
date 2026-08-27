import {db, migration } from "../src/config/db.js"

const dbMigration = async () => {
    console.log("starting database migration...")
    await migration()
    await db.end()
     console.log("database migration completed!")
}

dbMigration();