import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = req.headers.authorization?.replace('Bearer ', '')
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user || user.user_metadata?.role !== 'teacher') return res.status(403).json({ error: 'Acesso negado' })

  // Limite de vagas específico por professor (padrão 30)
  const slotLimit = user.user_metadata?.slot_limit || 30

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email obrigatório' })

  const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  const students = (authData?.users || []).filter(u => u.user_metadata?.role !== 'teacher' && u.id !== user.id)
  if (students.length >= slotLimit) return res.status(400).json({ error: `Limite de ${slotLimit} acessos atingido.` })

  const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: 'https://english-step-by-step.vercel.app/auth/confirmar'
  })
  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ ok: true })
}
