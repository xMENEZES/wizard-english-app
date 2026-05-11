import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = req.headers.authorization?.replace('Bearer ', '')
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user || user.user_metadata?.role !== 'teacher') return res.status(403).json({ error: 'Acesso negado' })

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId obrigatório' })

  await supabaseAdmin.from('profiles').delete().eq('id', userId)
  await supabaseAdmin.from('exercise_results').delete().eq('user_id', userId)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ ok: true })
}
