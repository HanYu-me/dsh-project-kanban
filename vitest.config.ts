import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

// Tests must never read or write the user's real board file.
export default defineConfig({
  test: {
    env: { DSH_PROJECT_KANBAN_FILE: join(tmpdir(), `dsh-project-kanban-test-${process.pid}`, 'board.json') },
  },
})
