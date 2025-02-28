/// <reference types="react" />

/**
 * This file contains type declarations to fix TypeScript errors with React hooks.
 * It's a simple workaround for the deployment issue.
 */
declare namespace React {
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useState<T = undefined>(): [T | undefined, (newState: T | ((prevState: T | undefined) => T)) => void];
} 