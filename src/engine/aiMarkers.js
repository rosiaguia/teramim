const RESP_MAP = {
  RESP_ALIVIO: 'alivio',
  RESP_CALMA: 'alivio',
  RESP_ZEN: 'zero',
  RESP_ZERO: 'zero',
  RESP_BOOT: 'boot',
  RESP_NEURO: 'foco',
  RESP_EQUI: 'equi',
  RESP_FOCO: 'foco'
}

export function parseAiReply(raw) {
  let text = raw || ''
  const replies = []
  let action = null

  const mReplies = text.match(/\[\[REPLIES:([^\]]+)\]\]/)
  if (mReplies) {
    mReplies[1].split('|').map((s) => s.trim()).filter(Boolean).forEach((label, i) => {
      replies.push({ id: 'ai_rep_' + i, label })
    })
  }

  const mResp = text.match(/\[\[RESP:([A-Z_]+)\]\]/)
  if (mResp && RESP_MAP[mResp[1]]) action = { type: 'openResp', respId: RESP_MAP[mResp[1]] }

  if (!action && text.includes('[[SOS]]')) action = { type: 'openSos' }
  if (!action && text.includes('[[UPSELL]]')) action = { type: 'openUpsell' }
  if (!action && text.includes('[[END]]')) action = { type: 'endSession' }

  const mRem = text.match(/\[\[REMINDER:(\d{1,2}:\d{2})\]\]/)
  if (mRem) action = { type: 'setReminder', time: mRem[1] }

  text = text
    .replace(/\[\[REPLIES:[^\]]+\]\]/g, '')
    .replace(/\[\[RESP:[A-Z_]+\]\]/g, '')
    .replace(/\[\[SOS\]\]/g, '')
    .replace(/\[\[UPSELL\]\]/g, '')
    .replace(/\[\[END\]\]/g, '')
    .replace(/\[\[REMINDER:[^\]]+\]\]/g, '')
    .trim()

  return { text, replies, action }
}
