import { defineGameEngine } from '../runtime/activityRuntime.js'

export function expandProgram(program, blocks) {
  return program.flatMap(key => blocks[key]?.moves || [])
}

export function evaluateGridProgram(activity, program, blocks) {
  return evaluateGridMoves(activity, expandProgram(program, blocks))
}

export function evaluateGridMoves(activity, moves) {
  const [columns, rows] = activity.grid
  const positions = [[...activity.start]]
  let [x, y] = activity.start
  let outside = false

  for (const move of moves) {
    if (move === 'up') y -= 1
    if (move === 'down') y += 1
    if (move === 'left') x -= 1
    if (move === 'right') x += 1
    if (x < 0 || x >= columns || y < 0 || y >= rows) { outside = true; break }
    positions.push([x, y])
  }

  return { position: [x, y], positions, outside }
}

export const gridEngine = defineGameEngine({
  initialState: activity => ({ program: [], position: [...activity.start], positions: [[...activity.start]], outside: false, runs: 0 }),
  reduce(state, action, activity) {
    if (action.type === 'reset') return this.initialState(activity)
    if (action.type === 'add' && state.program.length < 8 && activity.palette.includes(action.block)) return { ...state, program: [...state.program, action.block] }
    if (action.type === 'undo') return { ...state, program: state.program.slice(0, -1) }
    if (action.type === 'run') return { ...state, ...evaluateGridProgram(activity, state.program, action.blocks), runs: state.runs + 1 }
    return state
  },
  isComplete(state, activity) {
    return !state.outside && state.position[0] === activity.goal[0] && state.position[1] === activity.goal[1]
  },
  getFeedback(state, activity) {
    if (state.outside) return 'Bo-Bo đã đi ra ngoài sân khấu. Em sửa hướng rồi thử lại nhé!'
    if (this.isComplete(state, activity)) return 'Chương trình đã đưa Bo-Bo tới đúng mục tiêu.'
    if (state.runs) return 'Bo-Bo chưa tới ngôi sao. Em đổi thứ tự hoặc thêm block nhé!'
    return 'Ghép các block theo thứ tự, rồi chạy chương trình.'
  },
  serialize(state) {
    return { ...state, program: [...state.program], position: [...state.position], positions: state.positions.map(position => [...position]) }
  }
})
