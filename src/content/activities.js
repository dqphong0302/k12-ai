import { activityRegistry as primaryActivityRegistry } from './primaryActivities.js'
import { highActivities } from './highActivities.js'
import { middleActivities } from './middleActivities.js'
import { lessonActivities } from './lessonActivities.js'

export const activityRegistry = [...lessonActivities, ...primaryActivityRegistry, ...middleActivities, ...highActivities]
const activitiesById = new Map(activityRegistry.map(activity => [activity.id, activity]))

export function getActivity(activityId) {
  return activitiesById.get(activityId)
}
