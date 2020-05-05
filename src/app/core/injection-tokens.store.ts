import { InjectionToken } from '@angular/core';

/**
 * Injection token for fish list API endpoint
 */
export const FISH_URL = new InjectionToken<string>('FISH_URL');

/**
 * Injection token for bug list API endpoint
 */
export const BUG_URL = new InjectionToken<string>('BUG_URL');
