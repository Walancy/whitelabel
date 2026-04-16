import { useState, useCallback, useMemo } from 'react';
import type { LayoutNode } from '../types';

export type SplitSide = 'top' | 'right' | 'bottom' | 'left';

const KEY = 'whitelabel:layout:vInitialClean';
const uid = () => Math.random().toString(36).slice(2, 8);
export const makeLeaf = (): LayoutNode => ({ id: uid(), dir: 'row', children: [], widgets: [], contentDir: 'row', size: 1 });

function update(root: LayoutNode, id: string, fn: (n: LayoutNode) => LayoutNode): LayoutNode {
  if (root.id === id) return fn(root);
  return { ...root, children: root.children.map(c => update(c, id, fn)), size: root.size };
}

function removeNode(root: LayoutNode, id: string): LayoutNode {
  return { ...root, children: root.children.filter(c => c.id !== id).map(c => removeNode(c, id)), size: root.size };
}

function splitNode(root: LayoutNode, targetId: string, side: SplitSide): LayoutNode {
  if (root.children.some(c => c.id === targetId)) {
    const idx = root.children.findIndex(c => c.id === targetId);
    const target = root.children[idx];
    
    const isRow = side === 'left' || side === 'right';
    const isBefore = side === 'left' || side === 'top';
    const reqDir = isRow ? 'row' : 'col';
    
    if (root.dir === reqDir) {
      const next = [...root.children];
      const halfSize = Math.max(0.1, target.size / 2);
      next[idx] = { ...target, size: halfSize };
      const leaf = { ...makeLeaf(), size: halfSize };
      next.splice(isBefore ? idx : idx + 1, 0, leaf);
      return { ...root, children: next };
    } else {
      const targetCopy = { ...target, size: 1 };
      const leaf = { ...makeLeaf(), size: 1 };
      const newItems = isBefore ? [leaf, targetCopy] : [targetCopy, leaf];
      const wrapper: LayoutNode = { id: uid(), dir: reqDir, children: newItems, widgets: [], contentDir: 'row', size: target.size };
      const next = [...root.children];
      next.splice(idx, 1, wrapper);
      return { ...root, children: next };
    }
  }
  return { ...root, children: root.children.map(c => splitNode(c, targetId, side)), size: root.size };
}

function load(): LayoutNode {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : makeLeaf(); } catch { return makeLeaf(); }
}

function save(n: LayoutNode) { localStorage.setItem(KEY, JSON.stringify(n)); return n; }

export function useLayoutTree() {
  const [root, setRoot] = useState<LayoutNode>(load);

  const apply = useCallback((fn: (prev: LayoutNode) => LayoutNode) => {
    setRoot(prev => save(fn(prev)));
  }, []);

  const usedWidgets = useMemo(() => {
    const used = new Set<string>();
    const walk = (n: LayoutNode) => {
      n.widgets.forEach(w => used.add(w.type));
      n.children.forEach(walk);
    };
    walk(root);
    return Array.from(used);
  }, [root]);

  const split = useCallback((id: string, side: SplitSide) => {
    apply(prev => {
      if (prev.id === id) {
        const isRow = side === 'left' || side === 'right';
        const isBefore = side === 'left' || side === 'top';
        const reqDir = isRow ? 'row' : 'col';
        return {
          id: uid(),
          dir: reqDir,
          size: prev.size || 1,
          children: isBefore ? [{ ...makeLeaf(), size: 1 }, { ...prev, size: 1 }] : [{ ...prev, size: 1 }, { ...makeLeaf(), size: 1 }],
          widgets: [],
          contentDir: 'row'
        };
      }
      return splitNode(prev, id, side);
    });
  }, [apply]);

  const splitRoot = useCallback((side: SplitSide) => {
    apply(prev => {
      const isRow = side === 'left' || side === 'right';
      const isBefore = side === 'left' || side === 'top';
      const reqDir = isRow ? 'row' : 'col';
      return {
        id: uid(),
        dir: reqDir,
        size: prev.size || 1,
        children: isBefore ? [{ ...makeLeaf(), size: 1 }, { ...prev, size: 1 }] : [{ ...prev, size: 1 }, { ...makeLeaf(), size: 1 }],
        widgets: [],
        contentDir: 'row'
      };
    });
  }, [apply]);

  const remove = useCallback((id: string) => {
    apply(prev => prev.id === id ? makeLeaf() : removeNode(prev, id));
  }, [apply]);

  const addWidget = useCallback((nodeId: string, type: string) => {
    if (usedWidgets.includes(type)) return;
    apply(prev => update(prev, nodeId, n => ({ ...n, widgets: [...n.widgets, { id: uid(), type }] })));
  }, [apply, usedWidgets]);

  const removeWidget = useCallback((nodeId: string, widgetId: string) => {
    apply(prev => update(prev, nodeId, n => ({ ...n, widgets: n.widgets.filter(w => w.id !== widgetId) })));
  }, [apply]);

  const moveWidget = useCallback((sourceNodeId: string, widgetId: string, targetNodeId: string, type: string) => {
    apply(prev => {
      let next = update(prev, sourceNodeId, n => ({ ...n, widgets: n.widgets.filter(w => w.id !== widgetId) }));
      next = update(next, targetNodeId, n => ({ ...n, widgets: [...n.widgets, { id: uid(), type }] }));
      return next;
    });
  }, [apply]);

  const setContentDir = useCallback((nodeId: string, contentDir: 'row' | 'col') => {
    apply(prev => update(prev, nodeId, n => ({ ...n, contentDir })));
  }, [apply]);

  const resizeChildren = useCallback((parentId: string, newSizes: number[]) => {
    apply(prev => update(prev, parentId, n => ({
      ...n,
      children: n.children.map((c, i) => ({ ...c, size: newSizes[i] ?? c.size }))
    })));
  }, [apply]);

  const reset = useCallback(() => apply(() => makeLeaf()), [apply]);

  return { root, usedWidgets, split, splitRoot, remove, addWidget, removeWidget, moveWidget, setContentDir, resizeChildren, reset };
}
