import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RespModal from './RespModal.jsx'
import { RESP_LIBRARY } from '../data/respLibrary.js'
import { fetchAudios } from '../api/client.js'
import { mergeRespList } from '../engine/contentStore.js'
import { useContent } from '../engine/ContentContext.jsx'

const AUDIO_LABEL = { alivio: 'alivio', zero: 'zero', boot: 'boot', equi: 'equi', foco: 'foco' }

export default function RespPractice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { content } = useContent()
  const [audios, setAudios] = useState({})
  const list = content ? mergeRespList(content.respPractices) : RESP_LIBRARY
  const open = list.find((r) => r.id === id)

  useEffect(() => { fetchAudios().then(setAudios) }, [])

  return (
    <div className="resp-practice-page fade-in">
      {open && (
        <RespModal
          respId={open.id}
          standalone
          customAudioUrl={audios[AUDIO_LABEL[open.id]]?.url}
          onClose={() => navigate('/app/respiracao')}
        />
      )}
    </div>
  )
}
