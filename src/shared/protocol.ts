/**
 * Wire contract between the browser half and the host half.
 * @module dsh-project-kanban/shared/protocol
 */
import type { Board, Op } from './board'

/** Prefix of every route this plugin mounts. */
export const KANBAN_PREFIX = '/project-kanban'
/** GET → {@link BoardResponse}. */
export const BOARD_ENDPOINT = '/project-kanban/board'
/** POST {@link OpsRequest} → {@link OpsResponse}. */
export const OPS_ENDPOINT = '/project-kanban/ops'
/** Largest accepted request body. */
export const MAX_BODY_BYTES = 512 * 1024
/** Most ops accepted in one request. */
export const MAX_OPS_PER_REQUEST = 200

/** Body of a POST to {@link OPS_ENDPOINT}. */
export interface OpsRequest {
  ops: Op[]
}

/** Response of GET {@link BOARD_ENDPOINT}. */
export type BoardResponse = { ok: true; value: Board } | { ok: false; error: string }

/** Response of POST {@link OPS_ENDPOINT}: the stored board after the ops, plus refused ops. */
export type OpsResponse =
  | { ok: true; value: Board; refused: { index: number; reason: string }[] }
  | { ok: false; error: string }
