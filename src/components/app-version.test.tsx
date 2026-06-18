import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('1.2.3'),
}))

import { AppVersion } from './app-version'

describe('AppVersion', () => {
  it('renders the running app version once resolved', async () => {
    render(<AppVersion />)
    expect(await screen.findByText('v1.2.3')).toBeInTheDocument()
  })
})
