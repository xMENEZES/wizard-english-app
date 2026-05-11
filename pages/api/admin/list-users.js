import { supabaseAdmin } from '../../../lib/supabaseAdmin'
const SLOT_LIMIT = 30

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Sem token' })
  const { data: { user }, error: ue } = await supabaseAdmin.auth.getUser(token)
  if (!user || user.user_metadata?.role !== 'teacher') return res.status(403).json({ error: 'Acesso negado' })

  const { data: authData, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  if (error) return res.status(400).json({ error: error.message })

  const { data: profiles } = await supabaseAdmin.from('profiles').select('id, full_name').eq('role', 'student')
  const nameMap = {}
  if (profiles) profiles.forEach(p => { nameMap[p.id] = p.full_name })

  const students = authData.users
    .filter(u => u.user_metadata?.role !== 'teacher' && u.id !== user.id)
    .map(u => ({ id: u.id, email: u.email, full_name: nameMap[u.id] || null, created_at: u.created_at }))
    .sort((a, b) => (a.full_name || 'zzz').localeCompare(b.full_name || 'zzz'))

  res.status(200).json({ students, total: SLOT_LIMIT, used: students.length, available: SLOT_LIMIT - students.length })
}
