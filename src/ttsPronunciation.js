export function normalizeTtsPronunciation(input) {
  return input.replace(/(^|[^\p{L}\p{N}])AI(?=$|[^\p{L}\p{N}])/gu, '$1ây ai')
}
