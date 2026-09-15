import { defineGameEngine } from '../runtime/activityRuntime.js'

export const challengeEngine = defineGameEngine({
  initialState: () => ({step:0,mistakes:0,answer:null,history:[],lastCorrect:null}),
  reduce(state, action, game) {
    if (state.step >= game.rounds.length) return state
    if (action.type === 'next' && state.lastCorrect === true) return {...state,step:state.step+1,answer:null,lastCorrect:null}
    if (action.type !== 'choose' || state.lastCorrect === true || !Number.isInteger(action.index) || !game.rounds[state.step].options[action.index]) return state
    const correct = action.index === game.rounds[state.step].correct
    return {...state,answer:action.index,lastCorrect:correct,mistakes:state.mistakes+(correct?0:1),history:[...state.history,{round:state.step,answer:action.index,correct}]}
  },
  isComplete: (state,game) => state.step >= game.rounds.length,
  getFeedback: () => '',
  serialize: state => structuredClone(state)
})
