import postgres from 'postgres'

const sql = postgres('postgresql://postgres.vtemdbatuetcrbgylnob:8RkWheqq11yCuDMp@aws-1-us-west-1.pooler.supabase.com:6543/postgres')

async function checkTables() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    console.log(`\n📋 Tables in Supabase (${tables.length} total):`)
    tables.forEach(t => console.log(`  • ${t.table_name}`))
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await sql.end()
  }
}

checkTables()