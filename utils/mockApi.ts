export type MockRecord<T = any> = T & { id?: string }

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockRegisterAssessorModerator<T>(payload: MockRecord<T>): Promise<T> {
  await delay(350)
  return { ...payload, id: payload.id || crypto.randomUUID?.() || String(Date.now()) } as T
}

export async function mockRegisterLearner<T>(payload: MockRecord<T>): Promise<T> {
  await delay(350)
  return { ...payload, id: payload.id || crypto.randomUUID?.() || String(Date.now()) } as T
}

export async function mockFlagUpdate<T>(payload: T): Promise<T> {
  await delay(200)
  return payload
}
