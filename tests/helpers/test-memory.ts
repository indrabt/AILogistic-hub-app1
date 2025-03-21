/**
 * Test Memory Helper
 * 
 * This module provides a mechanism for storing and retrieving test data
 * across different test runs. It uses both sessionStorage (for browser sessions)
 * and the file system (for persistent storage across test runs).
 * 
 * Usage:
 * 1. At the end of a test, call storeTestData to save data
 * 2. In subsequent tests, call retrieveTestData to get the data
 */

import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DATA_DIR = path.join(__dirname, '../test-data');

// Make sure the test data directory exists
if (!fs.existsSync(TEST_DATA_DIR)) {
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
}

/**
 * Store test data in both session storage and file system
 */
export async function storeTestData(
  page: Page, 
  key: string, 
  data: any, 
  options: { persistToFile?: boolean } = {}
): Promise<void> {
  // Store in session storage
  await page.evaluate(({ key, data }) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error storing data in session storage:', error);
      return false;
    }
  }, { key, data });

  // Also store in file system if requested
  if (options.persistToFile) {
    const filePath = path.join(TEST_DATA_DIR, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

/**
 * Retrieve test data from session storage or file system
 */
export async function retrieveTestData<T>(
  page: Page, 
  key: string, 
  options: { fallbackToFile?: boolean } = {}
): Promise<T | null> {
  // Try to get from session storage first
  const sessionData = await page.evaluate((key) => {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }, key);

  // If we have data from session storage, return it
  if (sessionData) {
    return sessionData as T;
  }

  // Otherwise try the file system if requested
  if (options.fallbackToFile) {
    const filePath = path.join(TEST_DATA_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData) as T;
    }
  }

  // Nothing found
  return null;
}

/**
 * Clear test data from both session storage and file system
 */
export async function clearTestData(
  page: Page, 
  key: string, 
  options: { removeFile?: boolean } = {}
): Promise<void> {
  // Clear from session storage
  await page.evaluate((key) => {
    sessionStorage.removeItem(key);
  }, key);

  // Also clear from file system if requested
  if (options.removeFile) {
    const filePath = path.join(TEST_DATA_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * Compare current UI state with stored test data and return differences
 */
export async function compareWithStoredData<T>(
  page: Page,
  key: string,
  getCurrentStateFunction: () => Promise<T[]>,
  compareFunction: (storedItem: T, currentItem: T) => boolean | Record<string, any>
): Promise<Array<Record<string, any>>> {
  // Retrieve stored data
  const storedData = await retrieveTestData<T[]>(page, key, { fallbackToFile: true });
  if (!storedData) {
    return [];
  }

  // Get current state
  const currentState = await getCurrentStateFunction();

  // Compare stored data with current state
  const differences: Array<Record<string, any>> = [];
  for (const storedItem of storedData) {
    // Find matching item in current state
    const currentItem = currentState.find(item => 
      // This assumes items have an 'id' property for matching
      (item as any).id === (storedItem as any).id
    );

    if (currentItem) {
      const comparisonResult = compareFunction(storedItem, currentItem);
      if (comparisonResult !== false) {
        if (comparisonResult === true) {
          differences.push({ 
            storedItem: storedItem as unknown as Record<string, any>, 
            currentItem: currentItem as unknown as Record<string, any> 
          });
        } else {
          differences.push(comparisonResult as Record<string, any>);
        }
      }
    }
  }

  return differences;
}