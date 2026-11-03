/**
 * Board persistence: one JSON file on the host, written through a temp file
 * + rename so a crash never leaves half a file. A missing file reads as an
 * empty board; an unreadable one is moved aside (never silently overwritten)
 * and the board starts empty.
 *
 * File: `~/.dsh/project-kanban/board.json` (override with
 * `DSH_PROJECT_KANBAN_FILE`).
 * @module dsh-project-kanban/store
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { applyOps, emptyBoard, sanitizeBoard, type Board, type Op } from './shared/board'

/** Persistence face, so tests can swap the file for memory. */
export interface BoardStore {
  read(): Board
  /**
   * Apply ops and persist once. The revision is bumped only when something
   * changed.
   */
  apply(ops: readonly Op[]): { board: Board; refused: { index: number; reason: string }[] }
}

/** The default file location. */
export function defaultBoardPath(): string {
  const override = process.env.DSH_PROJECT_KANBAN_FILE
  if (typeof override === 'string' && override !== '') return override
  return join(homedir(), '.dsh', 'project-kanban', 'board.json')
}

/** Shared op logic of both stores. */
function applyTo(current: Board, ops: readonly Op[]): { board: Board; refused: { index: number; reason: string }[]; changed: boolean } {
  const { board, refused } = applyOps(current, ops)
  const changed = board !== current
  return { board: changed ? { ...board, revision: current.revision + 1 } : current, refused, changed }
}

/**
 * A file-backed store. The board is kept in memory after the first read;
 * every write goes to disk before the call returns (Node runs this
 * synchronously, so two requests can never interleave inside one apply).
 */
export function createFileStore(path: string = defaultBoardPath()): BoardStore {
  let cache: Board | undefined
  const load = (): Board => {
    if (cache) return cache
    if (!existsSync(path)) return (cache = emptyBoard())
    try {
      cache = sanitizeBoard(JSON.parse(readFileSync(path, 'utf8')))
    } catch (error) {
      const aside = `${path}.broken-${Date.now()}`
      console.warn(`[project-kanban] could not read ${path}; moved it to ${aside} and started an empty board.`, error)
      try {
        renameSync(path, aside)
      } catch {
        // Leave it; the next write replaces it.
      }
      cache = emptyBoard()
    }
    return cache
  }
  const save = (board: Board): void => {
    mkdirSync(dirname(path), { recursive: true })
    const temp = `${path}.${process.pid}.tmp`
    writeFileSync(temp, `${JSON.stringify(board, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
    renameSync(temp, path)
  }
  return {
    read: () => load(),
    apply(ops) {
      const result = applyTo(load(), ops)
      if (result.changed) {
        save(result.board)
        cache = result.board
      }
      return { board: result.board, refused: result.refused }
    },
  }
}

/** An in-memory store (tests). */
export function createMemoryStore(initial: Board = emptyBoard()): BoardStore {
  let board = initial
  return {
    read: () => board,
    apply(ops) {
      const result = applyTo(board, ops)
      board = result.board
      return { board: result.board, refused: result.refused }
    },
  }
}
