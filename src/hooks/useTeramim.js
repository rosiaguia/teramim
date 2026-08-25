import { useReducer, useCallback, useEffect, useRef } from 'react'
import { initialState, reduce } from '../engine/teramimEngine'
import { getOrCreateUser, touchAccess, saveReminder } from '../engine/store'

export function useTeramim() {
  const sessionRef = useRef(null)
  const userRef = useRef(null)

  const [chat, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'START': {
          const user = action.user
          const initial = initialState()
          const result = reduce(initial, { type: 'start' }, { userName: user.name })
          return { ...state, started: true, ...result, user }
        }
        case 'REPLY':
        case 'TEXT': {
          const result = reduce(state, action, { userName: state.user && state.user.name })
          const msgs = state.messages.concat(
            action.type === 'REPLY' ? [{ role: 'user', text: action.label }] : [{ role: 'user', text: action.text }]
          )
          return { ...state, messages: msgs, ...result }
        }
        case 'CONTINUE': {
          const result = reduce(state, { type: 'continue' }, { userName: state.user && state.user.name })
          return { ...state, ...result }
        }
        case 'PRACTICE_DONE': {
          const result = reduce({ ...state, step: 'after_practice' }, { type: 'continue' }, { userName: state.user && state.user.name })
          return { ...state, ...result }
        }
        case 'SOS_DONE': {
          const result = reduce({ ...state, step: 'after_sos' }, { type: 'continue' }, { userName: state.user && state.user.name })
          return { ...state, ...result }
        }
        case 'SET_ACTION': {
          return { ...state, action: action.payload }
        }
        default:
          return state
      }
    },
    {
      started: false,
      messages: [],
      replies: [],
      awaiting: null,
      action: null,
      state: initialState(),
      user: null
    }
  )

  const ensureSession = useCallback(() => {
    if (!sessionRef.current) {
      sessionRef.current = {
        id: 'ses_' + Math.random().toString(36).slice(2, 10),
        startedAt: new Date().toISOString()
      }
      userRef.current = getOrCreateUser()
      touchAccess(sessionRef.current, userRef.current)
    }
  }, [])

  useEffect(() => {
    if (sessionRef.current && !chat.started) {
      dispatch({ type: 'START', user: userRef.current })
    }
  }, [chat.started])

  const sendReply = useCallback((reply) => {
    dispatch({ type: 'REPLY', id: reply.id, label: reply.label })
  }, [])

  const sendText = useCallback((text) => {
    dispatch({ type: 'TEXT', text })
  }, [])

  const continueFlow = useCallback(() => {
    dispatch({ type: 'CONTINUE' })
  }, [])

  const setReminder = useCallback((time) => {
    const user = userRef.current || getOrCreateUser()
    saveReminder(user.id, time)
  }, [])

  return {
    ensureSession,
    chat,
    sendReply,
    sendText,
    continueFlow,
    setReminder
  }
}
