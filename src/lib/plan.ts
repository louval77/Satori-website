/*
 * Free vs Pro plan state.
 *
 * Payments are not connected (hackathon prototype). Pro can only be unlocked on a
 * device with the developer access code. The check compares a salted SHA-256 hash,
 * so the code itself is not in the website files. Because this runs in the browser,
 * it is a demo gate, not real protection: a real launch needs a payment provider and
 * a server that checks subscriptions.
 */
import { useSyncExternalStore } from 'react';
import { DEV_ACCESS } from '../config';
import { KEYS, readJson, removeKey, writeJson } from './storage';

export type Plan = 'free' | 'pro';
interface StoredPlan {
  plan: 'pro';
  via: 'developer';
  at: string;
}

const listeners = new Set<() => void>();
let cached: Plan | undefined;

export function getPlan(): Plan {
  if (cached === undefined) cached = readJson<StoredPlan>(KEYS.plan)?.plan === 'pro' ? 'pro' : 'free';
  return cached;
}

function emit(): void {
  listeners.forEach((l) => l());
}

export function usePlan(): Plan {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getPlan,
    () => 'free' as Plan,
  );
}

export function leavePro(): void {
  cached = 'free';
  removeKey(KEYS.plan);
  emit();
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

interface Lock {
  fails: number;
  until: number;
}

export function lockRemainingSeconds(): number {
  const lock = readJson<Lock>(KEYS.devLock);
  if (!lock || lock.until <= Date.now()) return 0;
  return Math.ceil((lock.until - Date.now()) / 1000);
}

export type UnlockResult = { ok: true } | { ok: false; reason: 'wrong' | 'locked' | 'unsupported'; waitSeconds?: number };

/** Checks a developer access code. Repeated wrong attempts lock the form for a while. */
export async function tryDeveloperCode(input: string): Promise<UnlockResult> {
  const wait = lockRemainingSeconds();
  if (wait > 0) return { ok: false, reason: 'locked', waitSeconds: wait };
  if (!window.crypto?.subtle) return { ok: false, reason: 'unsupported' };

  const code = input.trim().toUpperCase();
  const hash = await sha256Hex(`${DEV_ACCESS.salt}:${code}`);
  if (hash === DEV_ACCESS.sha256) {
    removeKey(KEYS.devLock);
    cached = 'pro';
    writeJson(KEYS.plan, { plan: 'pro', via: 'developer', at: new Date().toISOString() } satisfies StoredPlan);
    emit();
    return { ok: true };
  }

  const prev = readJson<Lock>(KEYS.devLock) ?? { fails: 0, until: 0 };
  const fails = prev.until && prev.until <= Date.now() ? 1 : prev.fails + 1;
  const until = fails >= DEV_ACCESS.maxAttempts ? Date.now() + DEV_ACCESS.lockoutSeconds * 1000 : 0;
  writeJson(KEYS.devLock, { fails: until ? 0 : fails, until });
  return until
    ? { ok: false, reason: 'locked', waitSeconds: DEV_ACCESS.lockoutSeconds }
    : { ok: false, reason: 'wrong' };
}
