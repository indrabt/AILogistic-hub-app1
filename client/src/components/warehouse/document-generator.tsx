/**
 * Document Generator Component
 * 
 * This component generates printable warehouse documents such as receiving slips,
 * put-away instructions, and inventory reports.
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Loader2, Printer, FileDown, ClipboardList } from 'lucide-react';
import { InboundOrder, InboundOrderItem } from '../../shared/warehouse-types';
import { format } from 'date-fns';

interface DocumentGeneratorProps {
  documentType: 'receiving-slip' | 'putaway-instruction' | 'inventory-report';
  data: InboundOrder | any;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentGenerator({
  documentType,
  data,
  isOpen,
  onClose
}: DocumentGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(true);
  
  const handlePrint = () => {
    setIsLoading(true);
    
    // In a real application, this would prepare the document for printing
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        const documentContent = generateDocumentContent();
        printWindow.document.write(documentContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Add slight delay to ensure content is loaded
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          setIsLoading(false);
        }, 500);
      } else {
        alert('Please allow pop-ups to print documents');
        setIsLoading(false);
      }
    }, 1000);
  };
  
  const handleDownload = () => {
    setIsLoading(true);
    
    // In a real application, this would generate a PDF file and download it
    setTimeout(() => {
      const documentContent = generateDocumentContent();
      const blob = new Blob([documentContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateFileName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsLoading(false);
    }, 1000);
  };
  
  const generateFileName = () => {
    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    
    switch (documentType) {
      case 'receiving-slip':
        return `receiving-slip-${data.orderNumber || data.id}-${timestamp}.html`;
      case 'putaway-instruction':
        return `putaway-instruction-${data.orderNumber || data.id}-${timestamp}.html`;
      case 'inventory-report':
        return `inventory-report-${timestamp}.html`;
      default:
        return `warehouse-document-${timestamp}.html`;
    }
  };
  
  const generateDocumentContent = () => {
    let title, content;
    
    switch (documentType) {
      case 'receiving-slip':
        title = 'Receiving Slip';
        content = generateReceivingSlipContent();
        break;
      case 'putaway-instruction':
        title = 'Put-Away Instruction';
        content = generatePutAwayInstructionContent();
        break;
      case 'inventory-report':
        title = 'Inventory Report';
        content = generateInventoryReportContent();
        break;
      default:
        title = 'Warehouse Document';
        content = '<p>Document content not available</p>';
    }
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .document {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
          }
          .document-header {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .document-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .document-subtitle {
            font-size: 14px;
            color: #666;
            margin: 5px 0 0;
          }
          .document-meta {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            border: 1px solid #eee;
            padding: 10px;
            background: #f9f9f9;
          }
          .meta-group {
            flex: 1;
          }
          .meta-item {
            margin-bottom: 5px;
          }
          .meta-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .document-footer {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            font-size: 12px;
            color: #666;
          }
          .signature-area {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            border-top: 1px solid #333;
            width: 200px;
            padding-top: 5px;
            margin-top: 40px;
          }
          .barcode {
            text-align: center;
            margin: 20px 0;
            font-family: monospace;
            font-size: 24px;
            letter-spacing: 2px;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .document {
              border: none;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="document">
          ${content}
        </div>
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()">Print Document</button>
        </div>
      </body>
      </html>
    `;
  };
  
  const generateReceivingSlipContent = () => {
    if (!data) return '<p>No data available</p>';
    
    // Assuming data is an InboundOrder object
    const order = data as InboundOrder;
    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    
    return `
      <div class="document-header">
        <h1 class="document-title">Receiving Slip</h1>
        <p class="document-subtitle">Generated on ${currentDate}</p>
      </div>
      
      <div class="document-meta">
        <div class="meta-group">
          <div class="meta-item">
            <span class="meta-label">Order Number:</span> ${order.orderNumber}
          </div>
          <div class="meta-item">
            <span class="meta-label">Supplier:</span> ${order.supplierName}
          </div>
          <div class="meta-item">
            <span class="meta-label">Supplier Reference:</span> ${order.supplierReference}
          </div>
        </div>
        <div class="meta-group">
          <div class="meta-item">
            <span class="meta-label">Expected Delivery:</span> ${order.expectedDeliveryDate}
          </div>
          <div class="meta-item">
            <span class="meta-label">Status:</span> ${order.status}
          </div>
          <div class="meta-item">
            <span class="meta-label">Created By:</span> ${order.createdBy}
          </div>
        </div>
      </div>
      
      <div class="barcode">
        *${order.orderNumber}*
      </div>
      
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Expected Qty</th>
            <th>Received Qty</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item: InboundOrderItem) => `
            <tr>
              <td>${item.sku}</td>
              <td>${item.productName}</td>
              <td>${item.expectedQuantity}</td>
              <td>${item.receivedQuantity}</td>
              <td>${item.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="notes">
        <h3>Notes</h3>
        <p>${order.notes || 'No notes'}</p>
      </div>
      
      <div class="signature-area">
        <div>
          <div class="signature-box">Received By</div>
        </div>
        <div>
          <div class="signature-box">Authorized By</div>
        </div>
      </div>
      
      <div class="document-footer">
        <p>This document was automatically generated by AI Logistics Hub</p>
      </div>
    `;
  };
  
  const generatePutAwayInstructionContent = () => {
    // Implementation for put-away instruction
    return '<p>Put-away instruction content</p>';
  };
  
  const generateInventoryReportContent = () => {
    // Implementation for inventory report
    return '<p>Inventory report content</p>';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {documentType === 'receiving-slip' && 'Receiving Slip'}
            {documentType === 'putaway-instruction' && 'Put-Away Instruction'}
            {documentType === 'inventory-report' && 'Inventory Report'}
          </DialogTitle>
          <DialogDescription>
            Preview and print or download warehouse documents
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {isPreviewReady ? (
            <div className="border rounded-md p-4 max-h-[500px] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {documentType === 'receiving-slip' && 'Receiving Slip'}
                  {documentType === 'putaway-instruction' && 'Put-Away Instruction'}
                  {documentType === 'inventory-report' && 'Inventory Report'}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(), 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
              
              {documentType === 'receiving-slip' && data && (
                <>
                  <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-muted/50 rounded-md">
                    <div>
                      <p><span className="font-medium">Order Number:</span> {data.orderNumber}</p>
                      <p><span className="font-medium">Supplier:</span> {data.supplierName}</p>
                      <p><span className="font-medium">Reference:</span> {data.supplierReference}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Expected Delivery:</span> {data.expectedDeliveryDate}</p>
                      <p><span className="font-medium">Status:</span> {data.status}</p>
                      <p><span className="font-medium">Created By:</span> {data.createdBy}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data.items.map((item: InboundOrderItem) => (
                            <tr key={item.id}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{item.sku}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{item.productName}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{item.expectedQuantity}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{item.receivedQuantity}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{item.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              
              {/* Other document types would go here */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p>Preparing document preview...</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isLoading || !isPreviewReady}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Download
          </Button>
          
          <Button
            onClick={handlePrint}
            disabled={isLoading || !isPreviewReady}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}