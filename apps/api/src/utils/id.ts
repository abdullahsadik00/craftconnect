/**
 * ID Generation Module
 * 
 * WHAT: Generates unique identifiers for database records
 * WHY:
 *   1. Every record needs a unique ID
 *   2. UUIDs are globally unique (no collisions)
 *   3. Can be generated on client (no DB required)
 * 
 * ALTERNATIVES:
 *   1. Auto-increment integers (OK - but not for distributed systems)
 *   2. MongoDB ObjectId (OK - but only for MongoDB)
 *   3. CUID/NanoID (OK - shorter than UUID)
 * 
 * WHY UUID V4:
 *   - Standard format (accepted everywhere)
 *   - Zero chance of collision
 *   - Built into most languages
 */

import { v4 as uuidv4 } from 'uuid';
/**
 * Generate a new UUID v4
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */

export function generateId(): string {
    return uuidv4();
}

/**
 * Validate if a string is a valid UUID
 */

export function isValidId(id: string): boolean {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(id);
}

export default generateId;