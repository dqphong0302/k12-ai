const initial = () => ({ step: 0, selected: [], mistakes: 0, lastCorrect: null })

export const primaryNewGameEngine = {
  initialState: initial,
  reduce(state, action, game) {
    if (action.type !== 'choose' || state.step >= game.rounds.length) return state
    const round = game.rounds[state.step]
    const expected = round.correct
    const choice = action.choice
    const correct = Array.isArray(expected) ? expected[state.selected.length] === choice : expected === choice
    if (!correct) return { ...state, mistakes: state.mistakes + 1, lastCorrect: false }
    const selected = [...state.selected, choice]
    const completeRound = Array.isArray(expected) ? selected.length === expected.length : true
    return completeRound
      ? { ...state, step: state.step + 1, selected: [], lastCorrect: true }
      : { ...state, selected, lastCorrect: true }
  },
  isComplete(state, game) { return state.step >= game.rounds.length },
  getFeedback(state, game) {
    if (state.lastCorrect === false) return game.rounds[Math.min(state.step, game.rounds.length - 1)].wrong
    if (state.lastCorrect === true) return state.step >= game.rounds.length ? 'Đúng rồi! Em đã hoàn thành tất cả lượt chơi.' : 'Đúng rồi! Tiếp tục lượt tiếp theo nhé.'
    return ''
  }
}
