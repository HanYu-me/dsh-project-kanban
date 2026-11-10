/**
 * Undo and redo for the records page: for every op, the ops that take its
 * effect back, worked out from the records as they were just before it.
 *
 * Undoing by inverse ops (rather than by putting an old copy of the whole
 * records back) only reverts what the user did, so changes that another
 * conversation made in the meantime stay.
 * @module dsh-project-kanban/shared/records-history
 */
import {
  applyRecordOp,
  categoriesOf,
  childrenOf,
  indexNodes,
  listOf,
  relationsOf,
  subtreeIds,
  type ProjectRecords,
  type RecordNode,
  type RecordOp,
  type RecordSide,
} from './records'

function find(records: ProjectRecords, id: string): { side: RecordSide; node: RecordNode } | undefined {
  const data = records.data.find((node) => node.id === id)
  if (data) return { side: 'data', node: data }
  const result = records.results.find((node) => node.id === id)
  return result ? { side: 'result', node: result } : undefined
}

type Update<T extends RecordOp['type']> = Extract<RecordOp, { type: T }>

/**
 * The ops that undo `op`, given the records as they were just before it was
 * applied. Applying them to the records after `op` gives back the records
 * before it (leaving aside `updatedAt` stamps and the order of links).
 * @returns nothing to do when `op` could not have changed anything.
 */
export function invertRecordOp(before: ProjectRecords, op: RecordOp): RecordOp[] {
  const projectId = op.projectId
  switch (op.type) {
    case 'node.add':
      return [{ type: 'node.delete', projectId, nodeId: op.id }]

    case 'node.update': {
      const found = find(before, op.nodeId)
      if (!found) return []
      const back: Update<'node.update'> = { type: 'node.update', projectId, nodeId: op.nodeId }
      if (op.name !== undefined) back.name = found.node.name
      if (op.path !== undefined) back.path = found.node.path
      if (op.description !== undefined) back.description = found.node.description
      if (op.collapsed !== undefined) back.collapsed = found.node.collapsed
      if (op.starred !== undefined) back.starred = found.node.starred === true
      if (op.category !== undefined) back.category = found.node.category ?? null
      return [back]
    }

    case 'node.move': {
      const found = find(before, op.nodeId)
      if (!found) return []
      const siblings = childrenOf(indexNodes(listOf(before, found.side)), found.node.parentId)
      const at = siblings.findIndex((node) => node.id === found.node.id)
      return [{ type: 'node.move', projectId, nodeId: found.node.id, parentId: found.node.parentId, beforeId: siblings[at + 1]?.id ?? null }]
    }

    case 'node.delete': {
      const found = find(before, op.nodeId)
      if (!found) return []
      const list = listOf(before, found.side)
      const index = indexNodes(list)
      const at = list.findIndex((node) => node.id === found.node.id)
      if (op.lift === true) {
        // Put the node back on its own, then its children under it again.
        const own = (id: string): boolean => id === found.node.id
        return [
          {
            type: 'node.restore',
            projectId,
            side: found.side,
            nodes: [found.node],
            links: before.links.filter((link) => own(link.dataId) || own(link.resultId)),
            relations: relationsOf(before).filter((relation) => own(relation.fromId) || own(relation.toId)),
            index: at,
          },
          ...childrenOf(index, found.node.id).map((kid): RecordOp => ({ type: 'node.move', projectId, nodeId: kid.id, parentId: found.node.id, beforeId: null })),
        ]
      }
      const gone = new Set(subtreeIds(index, found.node.id))
      const slot = at - list.slice(0, at).filter((node) => gone.has(node.id)).length
      return [
        {
          type: 'node.restore',
          projectId,
          side: found.side,
          nodes: list.filter((node) => gone.has(node.id)),
          links: before.links.filter((link) => gone.has(link.dataId) || gone.has(link.resultId)),
          relations: relationsOf(before).filter((relation) => gone.has(relation.fromId) || gone.has(relation.toId)),
          index: slot,
        },
      ]
    }

    case 'node.restore': {
      const ids = new Set(op.nodes.map((node) => node.id))
      const root = op.nodes.find((node) => node.parentId === null || !ids.has(node.parentId))
      return root ? [{ type: 'node.delete', projectId, nodeId: root.id }] : []
    }

    case 'link.add':
      return [{ type: 'link.delete', projectId, linkId: op.id }]

    case 'link.update': {
      const link = before.links.find((item) => item.id === op.linkId)
      return link ? [{ type: 'link.update', projectId, linkId: link.id, category: link.category ?? null }] : []
    }

    case 'link.delete': {
      const link = before.links.find((item) => item.id === op.linkId)
      if (!link) return []
      return [{ type: 'link.add', projectId, id: link.id, dataId: link.dataId, resultId: link.resultId, at: link.createdAt, ...(link.category !== undefined ? { category: link.category } : {}) }]
    }

    case 'relation.add':
      return [{ type: 'relation.delete', projectId, relationId: op.id }]

    case 'relation.update': {
      const relation = relationsOf(before).find((item) => item.id === op.relationId)
      if (!relation) return []
      const back: Update<'relation.update'> = { type: 'relation.update', projectId, relationId: relation.id }
      if (op.directed !== undefined) back.directed = relation.directed === true
      if (op.reverse === true) back.reverse = true
      if (op.category !== undefined) back.category = relation.category ?? null
      return [back]
    }

    case 'relation.delete': {
      const relation = relationsOf(before).find((item) => item.id === op.relationId)
      if (!relation) return []
      return [
        {
          type: 'relation.add',
          projectId,
          id: relation.id,
          fromId: relation.fromId,
          toId: relation.toId,
          at: relation.createdAt,
          ...(relation.directed === true ? { directed: true } : {}),
          ...(relation.category !== undefined ? { category: relation.category } : {}),
        },
      ]
    }

    case 'category.add':
      return [{ type: 'category.delete', projectId, kind: op.kind, categoryId: op.id }]

    case 'category.update': {
      const category = categoriesOf(before, op.kind).find((item) => item.id === op.categoryId)
      if (!category) return []
      return [{ type: 'category.update', projectId, kind: op.kind, categoryId: category.id, ...(op.name !== undefined ? { name: category.name } : {}), ...(op.color !== undefined ? { color: category.color } : {}) }]
    }

    case 'category.delete': {
      const list = categoriesOf(before, op.kind)
      const at = list.findIndex((item) => item.id === op.categoryId)
      const category = list[at]
      if (!category) return []
      const back: RecordOp[] = [{ type: 'category.add', projectId, kind: op.kind, id: category.id, name: category.name, color: category.color, index: at }]
      // Whatever used it takes it up again.
      if (op.kind === 'node') {
        for (const node of [...before.data, ...before.results]) if (node.category === category.id) back.push({ type: 'node.update', projectId, nodeId: node.id, category: category.id })
      } else {
        for (const link of before.links) if (link.category === category.id) back.push({ type: 'link.update', projectId, linkId: link.id, category: category.id })
        for (const relation of relationsOf(before)) if (relation.category === category.id) back.push({ type: 'relation.update', projectId, relationId: relation.id, category: category.id })
      }
      return back
    }

    case 'palette.update': {
      const back: Update<'palette.update'> = { type: 'palette.update', projectId }
      for (const key of ['node', 'edge', 'star'] as const) if (op[key] !== undefined) back[key] = before.palette?.defaults?.[key] ?? null
      return [back]
    }

    default:
      return []
  }
}

/** What running a batch of ops did, and how to take it back. */
export interface Plan {
  /** The ops that fitted and changed something, in order. */
  applied: RecordOp[]
  /** The ops that undo `applied` (already in the order to run them). */
  inverse: RecordOp[]
  /** The records after `applied`. */
  after: ProjectRecords
  /** The ops that did not fit, by index in the given list. */
  refused: { index: number; reason: string }[]
}

/**
 * Work out a batch of ops without running them for real: which ones fit,
 * what they leave behind, and the ops that would undo them.
 * @param records - the records the batch starts from.
 * @param ops - the ops, in the order they will run.
 * @param at - the timestamp used while working it out.
 */
export function planOps(records: ProjectRecords, ops: readonly RecordOp[], at: string): Plan {
  let current = records
  const applied: RecordOp[] = []
  const inverses: RecordOp[][] = []
  const refused: { index: number; reason: string }[] = []
  ops.forEach((op, index) => {
    const result = applyRecordOp(current, op, at)
    if (!result.ok) {
      refused.push({ index, reason: result.reason })
      return
    }
    // An op that changes nothing is not worth an undo step.
    if (result.records === current) return
    inverses.push(invertRecordOp(current, op))
    applied.push(op)
    current = result.records
  })
  return { applied, inverse: inverses.reverse().flat(), after: current, refused }
}
