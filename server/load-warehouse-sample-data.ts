/**
 * Warehouse Sample Data Loader
 * 
 * This script loads sample data for the warehouse management system
 * from the sample_data/warehouse directory into the application storage.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { storage } from './storage-provider';

// Get the directory name from the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample data directory
const SAMPLE_DATA_DIR = path.join(__dirname, '..', 'sample_data', 'warehouse');

// Check if directory exists
if (!fs.existsSync(SAMPLE_DATA_DIR)) {
  console.error(`Sample data directory not found: ${SAMPLE_DATA_DIR}`);
  process.exit(1);
}

async function loadSampleData() {
  console.log('Loading warehouse sample data...');
  
  try {
    // Load inbound orders data
    const inboundOrdersPath = path.join(SAMPLE_DATA_DIR, 'inbound_orders.json');
    if (fs.existsSync(inboundOrdersPath)) {
      console.log('Loading inbound orders data...');
      const inboundOrders = JSON.parse(fs.readFileSync(inboundOrdersPath, 'utf8'));
      
      for (const order of inboundOrders) {
        // Store each inbound order
        await storage.createInboundOrder({
          ...order,
          items: [] // We'll add items separately
        });
        
        // Store inbound order items
        for (const item of order.items) {
          await storage.createInboundOrderItem({
            ...item,
            discrepancies: [] // We'll add discrepancies separately
          });
          
          // Store discrepancies
          for (const discrepancy of item.discrepancies) {
            await storage.createReceivingDiscrepancy(discrepancy);
          }
        }
      }
      console.log(`Loaded ${inboundOrders.length} inbound orders`);
    }
    
    // Load put-away tasks data
    const putAwayTasksPath = path.join(SAMPLE_DATA_DIR, 'putaway_tasks.json');
    if (fs.existsSync(putAwayTasksPath)) {
      console.log('Loading put-away tasks data...');
      const putAwayTasks = JSON.parse(fs.readFileSync(putAwayTasksPath, 'utf8'));
      
      for (const task of putAwayTasks) {
        await storage.createPutAwayTask(task);
      }
      console.log(`Loaded ${putAwayTasks.length} put-away tasks`);
    }
    
    // Load storage locations data
    const storageLocationsPath = path.join(SAMPLE_DATA_DIR, 'storage_locations.json');
    if (fs.existsSync(storageLocationsPath)) {
      console.log('Loading storage locations data...');
      const storageLocations = JSON.parse(fs.readFileSync(storageLocationsPath, 'utf8'));
      
      for (const location of storageLocations) {
        await storage.updateStorageLocation(location.id, location);
      }
      console.log(`Loaded ${storageLocations.length} storage locations`);
    }
    
    // Load inventory items data
    const inventoryItemsPath = path.join(SAMPLE_DATA_DIR, 'inventory_items.json');
    if (fs.existsSync(inventoryItemsPath)) {
      console.log('Loading inventory items data...');
      const inventoryItems = JSON.parse(fs.readFileSync(inventoryItemsPath, 'utf8'));
      
      for (const item of inventoryItems) {
        // Store each inventory item
        await storage.updateInventoryItem(item.id, {
          ...item,
          locations: [],
          attributes: []
        });
        
        // Store inventory locations
        for (const location of item.locations) {
          await storage.createInventoryMovement({
            inventoryItemId: item.id,
            toLocationId: location.locationId,
            quantity: location.quantity,
            type: 'receiving',
            referenceNumber: location.batchNumber || `INIT-${item.id}`,
            referenceType: 'initialization',
            performedBy: 'system',
            performedAt: new Date().toISOString(),
            notes: 'Initial sample data load'
          });
        }
        
        // Store inventory attributes
        for (const attribute of item.attributes) {
          // Assuming there's a method to add attributes
          // This would be implemented in the storage interface
        }
      }
      console.log(`Loaded ${inventoryItems.length} inventory items`);
    }
    
    // Load pick tasks data
    const pickTasksPath = path.join(SAMPLE_DATA_DIR, 'pick_tasks.json');
    if (fs.existsSync(pickTasksPath)) {
      console.log('Loading pick tasks data...');
      const pickTasks = JSON.parse(fs.readFileSync(pickTasksPath, 'utf8'));
      
      for (const task of pickTasks) {
        // Store each pick task
        await storage.createPickTask({
          ...task,
          items: [] // We'll add items separately
        });
        
        // Store pick task items
        for (const item of task.items) {
          await storage.updatePickTaskItem(item.id, item);
        }
      }
      console.log(`Loaded ${pickTasks.length} pick tasks`);
    }
    
    // Load packing tasks data
    const packingTasksPath = path.join(SAMPLE_DATA_DIR, 'packing_tasks.json');
    if (fs.existsSync(packingTasksPath)) {
      console.log('Loading packing tasks data...');
      const packingTasks = JSON.parse(fs.readFileSync(packingTasksPath, 'utf8'));
      
      for (const task of packingTasks) {
        // Store each packing task
        await storage.createPackingTask({
          ...task,
          items: [],
          packages: [] // We'll add these separately
        });
        
        // Store packing task items
        for (const item of task.items) {
          await storage.updatePackingTaskItem(item.id, item);
        }
        
        // Store packages
        for (const pkg of task.packages) {
          await storage.updateShipmentPackage(pkg.id, pkg);
        }
      }
      console.log(`Loaded ${packingTasks.length} packing tasks`);
    }
    
    console.log('Warehouse sample data loaded successfully!');
  } catch (error) {
    console.error('Error loading sample data:', error);
  }
}

// Run the loader
loadSampleData().catch(console.error);