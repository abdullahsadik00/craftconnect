// src/services/database.service.ts

/**
 * JSON Database Service
 * 
 * WHAT: A simple JSON file-based database
 * WHY:
 *   1. No external database needed
 *   2. Easy to understand and debug
 *   3. Perfect for learning
 *   4. Data persists between restarts
 * 
 * LIMITATIONS:
 *   1. Not suitable for production (no concurrent access handling)
 *   2. All data loaded in memory
 *   3. No transactions
 *   4. No indexing (slow for large datasets)
 * 
 * WHEN TO SWITCH:
 *   - More than 1000 records
 *   - Multiple server instances
 *   - Need for transactions
 *   - Need for complex queries
 */

import fs from 'fs/promises';
import path from 'path';
import config from '../config/index.js';
import logger from '../utils/logger.js';

// Type for our database collections
type CollectionName = 'users' | 'providers' | 'portfolios' | 'inquiries' | 'otps' | 'sessions';

/**
 * Generic database service for JSON file operations
 */
class DatabaseService {
  private dataDir: string;
  private cache: Map<string, any[]> = new Map();

  constructor() {
    this.dataDir = config.dataDir;
  }

  /**
   * Initialize the database
   * Creates data directory and empty JSON files if they don't exist
   */
  async initialize(): Promise<void> {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });

      // Initialize each collection
      const collections: CollectionName[] = [
        'users',
        'providers',
        'portfolios',
        'inquiries',
        'otps',
        'sessions',
      ];

      for (const collection of collections) {
        const filePath = this.getFilePath(collection);
        
        try {
          // Check if file exists
          await fs.access(filePath);
        } catch {
          // File doesn't exist, create it with empty array
          await fs.writeFile(filePath, '[]', 'utf-8');
          logger.info(`Created ${collection}.json`);
        }
      }

      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize database');
      throw error;
    }
  }

  /**
   * Get file path for a collection
   */
  private getFilePath(collection: CollectionName): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  /**
   * Read all records from a collection
   */
  async findAll<T>(collection: CollectionName): Promise<T[]> {
    try {
      // Check cache first
      if (this.cache.has(collection)) {
        return this.cache.get(collection) as T[];
      }

      const filePath = this.getFilePath(collection);
      const data = await fs.readFile(filePath, 'utf-8');
      const records = JSON.parse(data) as T[];
      
      // Update cache
      this.cache.set(collection, records);
      
      return records;
    } catch (error) {
      logger.error({ error, collection }, 'Failed to read collection');
      return [];
    }
  }

  /**
   * Find a single record by ID
   */
  async findById<T extends { id: string }>(
    collection: CollectionName,
    id: string
  ): Promise<T | null> {
    const records = await this.findAll<T>(collection);
    return records.find((record) => record.id === id) || null;
  }

  /**
   * Find records matching a condition
   */
  async findWhere<T>(
    collection: CollectionName,
    predicate: (record: T) => boolean
  ): Promise<T[]> {
    const records = await this.findAll<T>(collection);
    return records.filter(predicate);
  }

  /**
   * Find a single record matching a condition
   */
  async findOne<T>(
    collection: CollectionName,
    predicate: (record: T) => boolean
  ): Promise<T | null> {
    const records = await this.findAll<T>(collection);
    return records.find(predicate) || null;
  }

  /**
   * Create a new record
   */
  async create<T extends { id: string }>(
    collection: CollectionName,
    record: T
  ): Promise<T> {
    const records = await this.findAll<T>(collection);
    records.push(record);
    await this.saveCollection(collection, records);
    return record;
  }

  /**
   * Update an existing record
   */
  async update<T extends { id: string }>(
    collection: CollectionName,
    id: string,
    updates: Partial<T>
  ): Promise<T | null> {
    const records = await this.findAll<T>(collection);
    const index = records.findIndex((record) => record.id === id);
    
    if (index === -1) {
      return null;
    }

    records[index] = { ...records[index], ...updates };
    await this.saveCollection(collection, records);
    return records[index];
  }

  /**
   * Delete a record by ID
   */
  async delete<T extends { id: string }>(
    collection: CollectionName,
    id: string
  ): Promise<boolean> {
    const records = await this.findAll<T>(collection);
    const index = records.findIndex((record) => record.id === id);
    
    if (index === -1) {
      return false;
    }

    records.splice(index, 1);
    await this.saveCollection(collection, records);
    return true;
  }

  /**
   * Delete records matching a condition
   */
  async deleteWhere<T>(
    collection: CollectionName,
    predicate: (record: T) => boolean
  ): Promise<number> {
    const records = await this.findAll<T>(collection);
    const initialLength = records.length;
    const filteredRecords = records.filter((record) => !predicate(record));
    
    if (filteredRecords.length !== initialLength) {
      await this.saveCollection(collection, filteredRecords);
    }
    
    return initialLength - filteredRecords.length;
  }

  /**
   * Save collection to file
   */
  private async saveCollection<T>(
    collection: CollectionName,
    records: T[]
  ): Promise<void> {
    const filePath = this.getFilePath(collection);
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
    
    // Update cache
    this.cache.set(collection, records);
  }

  /**
   * Clear cache for a collection
   */
  clearCache(collection?: CollectionName): void {
    if (collection) {
      this.cache.delete(collection);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Count records in a collection
   */
  async count<T>(
    collection: CollectionName,
    predicate?: (record: T) => boolean
  ): Promise<number> {
    const records = await this.findAll<T>(collection);
    if (predicate) {
      return records.filter(predicate).length;
    }
    return records.length;
  }
}

// Export singleton instance
export const db = new DatabaseService();
export default db;