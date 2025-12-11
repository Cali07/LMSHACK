const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockRegisterAssessorModerator(payload) {
  await delay(350)
  return { ...payload, id: payload.id || crypto.randomUUID?.() || String(Date.now()) }
}

export async function mockRegisterLearner(payload) {
  await delay(350)
  return { ...payload, id: payload.id || crypto.randomUUID?.() || String(Date.now()) }
}

export async function mockFlagUpdate(payload) {
  await delay(200)
  return payload
}
