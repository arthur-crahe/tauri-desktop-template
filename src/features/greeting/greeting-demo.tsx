import { Button, Card, Flex, Text, TextField } from '@radix-ui/themes'
import { useState } from 'react'
import { greet } from '../../lib/commands'
import { isTauriRuntime } from '../../lib/runtime'

/**
 * Example feature demonstrating the React → Rust IPC round-trip.
 *
 * Sends a name to the Rust `greet` command (see `src-tauri/src/commands/greet.rs`)
 * through the typed binding in `src/lib/commands.ts`, and shows the reply. Inert
 * in a plain browser (`pnpm dev` without Tauri), where there is no IPC.
 *
 * This whole `features/greeting` folder is a placeholder — delete it (and its
 * import in `app.tsx`) when you build your own features.
 */
export function GreetingDemo() {
  const [name, setName] = useState('Ada')
  const [reply, setReply] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onGreet = async () => {
    setError(null)
    if (!isTauriRuntime()) {
      setError('La commande Rust n’est disponible que dans la fenêtre Tauri (pnpm tauri dev).')
      return
    }
    try {
      setReply(await greet(name))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Text size="2" weight="medium">
          Exemple : commande Rust
        </Text>
        <Flex gap="2" align="center">
          <TextField.Root
            size="2"
            value={name}
            placeholder="Votre nom"
            onChange={(e) => setName(e.target.value)}
          />
          <Button size="2" onClick={() => void onGreet()}>
            Saluer
          </Button>
        </Flex>
        {reply ? (
          <Text size="2" color="green">
            {reply}
          </Text>
        ) : null}
        {error ? (
          <Text size="1" color="gray">
            {error}
          </Text>
        ) : null}
      </Flex>
    </Card>
  )
}
