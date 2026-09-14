import { simulationEngine } from './simulationEngine.js'
import { sortingEngine } from './sortingEngine.js'
import { sequenceEngine } from './sequenceEngine.js'
import { gridEngine } from './gridEngine.js'
import { matchingEngine } from './matchingEngine.js'
import { privacyRuleEngine } from './privacyRuleEngine.js'
import { biasEngine } from './biasEngine.js'
import { projectCanvasEngine } from './projectCanvasEngine.js'
import { debugEngine } from './debugEngine.js'
import { primaryNewGameEngine } from './primaryNewGames.js'
import { challengeEngine } from './challengeEngine.js'

const engines = {
  challenge: challengeEngine,
  simulation: simulationEngine,
  sorting: sortingEngine,
  sequence: sequenceEngine,
  pipeline: sequenceEngine,
  code: gridEngine,
  matching: matchingEngine,
  shield: privacyRuleEngine,
  condition: privacyRuleEngine,
  balance: biasEngine,
  project: projectCanvasEngine,
  debug: debugEngine
  ,memory: primaryNewGameEngine
  ,sound: primaryNewGameEngine
  ,route: primaryNewGameEngine
  ,assembly: primaryNewGameEngine
}

export function getGameEngine(type) {
  return engines[type]
}
