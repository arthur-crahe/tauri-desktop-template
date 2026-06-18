import { describe, expect, it, vi } from 'vitest'

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue('Hello, Ada!'),
}))

import { invoke } from '@tauri-apps/api/core'
import { greet } from './commands'

const mockedInvoke = vi.mocked(invoke)

describe('greet', () => {
  it('invokes the Rust `greet` command with the name argument', async () => {
    const result = await greet('Ada')
    expect(mockedInvoke).toHaveBeenCalledWith('greet', { name: 'Ada' })
    expect(result).toBe('Hello, Ada!')
  })
})
