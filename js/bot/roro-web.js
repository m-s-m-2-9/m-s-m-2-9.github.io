/* ═══════════════════════════════════════════════════════════════════
   js/bot/roro-web.js  —  RoRo Internet Lookup Module
   Free APIs only. No keys. No costs.
   Sources: DuckDuckGo Instant Answer → Wikipedia REST → null
   Session cache prevents repeat calls.
   Exports: window.RoRoWeb = { lookup, tryMath, clearCache }
═══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const _cache  = new Map();   /* key → { summary, source, ts } */
const _flight = new Map();   /* key → Promise (dedup concurrent) */
const TTL     = 30 * 60 * 1000;

function _k(q){ return q.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim(); }

function _cap(text, n){
  n = n || 50;
  if(!text) return '';
  const w = text.trim().split(/\s+/);
  return w.length <= n ? text.trim() : w.slice(0,n).join(' ') + '\u2026';
}

async function _ddg(q){
  const url = 'https://api.duckduckgo.com/?q='+encodeURIComponent(q)+'&format=json&no_html=1&skip_disambig=1&no_redirect=1';
  try{
    const r = await fetch(url, {signal: AbortSignal.timeout(3500)});
    const d = await r.json();
    if(d.AbstractText && d.AbstractText.length > 30) return {summary: _cap(d.AbstractText), source:'DuckDuckGo'};
    if(d.Answer) return {summary: String(d.Answer), source:'DuckDuckGo'};
    if(d.RelatedTopics && d.RelatedTopics[0] && d.RelatedTopics[0].Text) return {summary: _cap(d.RelatedTopics[0].Text), source:'DuckDuckGo'};
    return null;
  }catch{return null;}
}

async function _wiki(term){
  try{
    const sr = await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(term)+'&srlimit=1&format=json&origin=*', {signal: AbortSignal.timeout(3500)});
    const sd = await sr.json();
    const title = sd?.query?.search?.[0]?.title;
    if(!title) return null;
    const pr = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title), {signal: AbortSignal.timeout(3500)});
    const pd = await pr.json();
    if(pd.extract && pd.extract.length > 30) return {summary: _cap(pd.extract), source:'Wikipedia'};
    return null;
  }catch{return null;}
}

async function lookup(query){
  const key = _k(query);
  if(_cache.has(key)){
    const c = _cache.get(key);
    if(Date.now() - c.ts < TTL) return c;
  }
  if(_flight.has(key)) return _flight.get(key);
  const p = (async()=>{
    let result = await _ddg(query);
    if(!result) result = await _wiki(query);
    if(result){ result.ts = Date.now(); _cache.set(key, result); }
    _flight.delete(key);
    return result;
  })();
  _flight.set(key, p);
  return p;
}

function tryMath(expr){
  try{
    const clean = String(expr).replace(/[^0-9\s\+\-\*\/\.\(\)%]/g,'').trim();
    if(!clean || clean.length > 50) return null;
    /* eslint-disable no-new-func */
    const result = Function('"use strict"; return ('+clean+')')();
    /* eslint-enable no-new-func */
    if(typeof result === 'number' && isFinite(result)){
      return Number.isInteger(result) ? String(result) : result.toFixed(8).replace(/\.?0+$/,'');
    }
    return null;
  }catch{return null;}
}

function clearCache(){ _cache.clear(); }

window.RoRoWeb = { lookup, tryMath, clearCache };
})();
