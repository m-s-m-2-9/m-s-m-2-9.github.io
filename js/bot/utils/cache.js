/* ═══════════════════════════════════════════════════════════════
   js/bot/utils/cache.js  —  RoRo v5 Cache Engine
   ─────────────────────────────────────────────────────────────
   LRU cache with TTL expiry and max-entry eviction.
   Used by web search, knowledge builder, and search engine.
   24-hour TTL for factual data (Wikipedia doesn't change hourly).
   Max 500 entries — evicts oldest when exceeded.
   Thread-safe via deduplication Map for in-flight requests.
   ─────────────────────────────────────────────────────────────
   SAVE AS: js/bot/utils/cache.js
   EXPORTS: window.RoRoCache
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const C = window.RORO_CONST;

  /* ── Generic LRU Cache with TTL ─────────────────────────── */
  class LRUCache {
    constructor(maxEntries, ttlMs) {
      this._max = maxEntries || 500;
      this._ttl = ttlMs || (24 * 60 * 60 * 1000);
      this._map = new Map();
    }

    get(key) {
      if (!this._map.has(key)) return null;
      const entry = this._map.get(key);
      if (Date.now() - entry.ts > this._ttl) {
        this._map.delete(key);
        return null;
      }
      /* Move to end (most recently used) */
      this._map.delete(key);
      this._map.set(key, entry);
      return entry.value;
    }

    set(key, value) {
      /* Evict oldest if at capacity */
      if (this._map.size >= this._max) {
        const oldestKey = this._map.keys().next().value;
        this._map.delete(oldestKey);
      }
      this._map.set(key, { value, ts: Date.now() });
    }

    has(key) {
      const v = this.get(key);
      return v !== null;
    }

    delete(key) {
      this._map.delete(key);
    }

    clear() {
      this._map.clear();
    }

    get size() {
      return this._map.size;
    }

    get stats() {
      return { size: this._map.size, maxSize: this._max, ttlHours: this._ttl / 3600000 };
    }
  }

  /* ── Request Deduplicator ───────────────────────────────── */
  /* Prevents duplicate in-flight requests for same key */
  class RequestDedup {
    constructor() {
      this._inflight = new Map();
    }

    async dedupe(key, fn) {
      if (this._inflight.has(key)) return this._inflight.get(key);
      const p = fn().finally(() => this._inflight.delete(key));
      this._inflight.set(key, p);
      return p;
    }

    has(key) { return this._inflight.has(key); }
    clear()  { this._inflight.clear(); }
  }

  /* ── Pre-built instances for each subsystem ─────────────── */
  window.RoRoCache = {
    web:       new LRUCache(
      (C && C.WEB && C.WEB.CACHE_MAX_ENTRIES) || 500,
      (C && C.WEB && C.WEB.CACHE_TTL_MS)      || 24 * 60 * 60 * 1000
    ),
    knowledge: new LRUCache(100, 60 * 60 * 1000),  /* 1hr — site content */
    search:    new LRUCache(200, 10 * 60 * 1000),  /* 10min — search results */
    ai:        new LRUCache(50,  30 * 60 * 1000),  /* 30min — AI responses */
    dedup:     new RequestDedup(),

    /* Convenience key normalizer */
    key(raw) {
      return (raw || '').toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120);
    },

    /* Stats across all caches */
    allStats() {
      return {
        web:       this.web.stats,
        knowledge: this.knowledge.stats,
        search:    this.search.stats,
        ai:        this.ai.stats,
      };
    },

    /* Clear all caches */
    clearAll() {
      this.web.clear();
      this.knowledge.clear();
      this.search.clear();
      this.ai.clear();
      this.dedup.clear();
    },
  };

})();
