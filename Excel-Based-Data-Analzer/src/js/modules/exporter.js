/**
 * Export Module
 * 
 * Handles exporting data, charts, and dashboards to various formats.
 */

class Exporter {
    constructor(options = {}) {
        this.options = options;
        this.exportFormats = {
            pdf: {
                name: 'PDF',
                extension: '.pdf',
                description: 'Portable Document Format',
                mimeType: 'application/pdf'
            },
            excel: {
                name: 'Excel',
                extension: '.xlsx',
                description: 'Microsoft Excel Workbook',
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            csv: {
                name: 'CSV',
                extension: '.csv',
                description: 'Comma Separated Values',
                mimeType: 'text/csv'
            },
            json: {
                name: 'JSON',
                extension: '.json',
                description: 'JavaScript Object Notation',
                mimeType: 'application/json'
            },
            png: {
                name: 'PNG',
                extension: '.png',
                description: 'Portable Network Graphics',
                mimeType: 'image/png'
            },
            svg: {
                name: 'SVG',
                extension: '.svg',
                description: 'Scalable Vector Graphics',
                mimeType: 'image/svg+xml'
            }
        };
    }
    
    /**
     * Export data to specified format
     */
    async export(format, options = {}) {
        try {
            // Validate format
            if (!this.exportFormats[format]) {
                throw new Error(`Unsupported export format: ${format}`);
            }
            
            // Get data to export
            const exportData = await this.prepareExportData(options);
            
            // Generate filename
            const filename = this.generateFilename(format, options);
            
            // Export based on format
            let result;
            switch (format) {
                case 'pdf':
                    result = await this.exportToPDF(exportData, options);
                    break;
                case 'excel':
                    result = await this.exportToExcel(exportData, options);
                    break;
                case 'csv':
                    result = await this.exportToCSV(exportData, options);
                    break;
                case 'json':
                    result = await this.exportToJSON(exportData, options);
                    break;
                case 'png':
                    result = await this.exportToPNG(exportData, options);
                    break;
                case 'svg':
                    result = await this.exportToSVG(exportData, options);
                    break;
                default:
                    throw new Error(`Export handler not implemented for format: ${format}`);
            }
            
            // Trigger download
            this.triggerDownload(result.data, filename, result.mimeType);
            
            // Notify completion
            if (this.options.onExportComplete) {
                this.options.onExportComplete({
                    format,
                    filename,
                    size: result.data.length,
                    timestamp: Date.now()
                });
            }
            
            return {
                success: true,
                format,
                filename,
                size: result.data.length
            };
            
        } catch (error) {
            console.error('Export failed:', error);
            if (this.options.onError) {
                this.options.onError(error);
            }
            throw error;
        }
    }
    
    /**
     * Prepare export data
     */
    async prepareExportData(options) {
        const data = {
            metadata: {
                title: options.title || 'Excel Analyzer Export',
                description: options.description || 'Exported from Excel Analyzer',
                timestamp: new Date().toISOString(),
                format: options.format,
                version: '1.0.0'
            },
            rawData: options.rawData || [],
            processedData: options.processedData || [],
            dataStructure: options.dataStructure || null,
            visualizations: options.visualizations || [],
            dashboard: options.dashboard || null,
            settings: options.settings || {}
        };
        
        return data;
    }
    
    /**
     * Export to PDF
     */
    async exportToPDF(data, options) {
        // For PDF export, we would typically use a library like jsPDF
        // This is a simplified implementation
        const content = this.generatePDFContent(data, options);
        
        // Convert to blob
        const blob = new Blob([content], { type: 'application/pdf' });
        
        return {
            data: blob,
            mimeType: 'application/pdf'
        };
    }
    
    /**
     * Export to Excel
     */
    async exportToExcel(data, options) {
        const workbook = {
            sheets: {
                'Raw Data': this.convertToSheet(data.rawData),
                'Processed Data': this.convertToSheet(data.processedData),
                'Summary': this.generateSummarySheet(data)
            }
        };
        
        // Convert to Excel format (would use a library like SheetJS)
        const excelData = this.convertToExcelFormat(workbook);
        
        return {
            data: excelData,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
    }
    
    /**
     * Export to CSV
     */
    async exportToCSV(data, options) {
        const targetData = options.includeProcessed ? data.processedData : data.rawData;
        const csvContent = this.convertToCSV(targetData);
        
        return {
            data: csvContent,
            mimeType: 'text/csv'
        };
    }
    
    /**
     * Export to JSON
     */
    async exportToJSON(data, options) {
        const jsonContent = JSON.stringify(data, null, 2);
        
        return {
            data: jsonContent,
            mimeType: 'application/json'
        };
    }
    
    /**
     * Export to PNG
     */
    async exportToPNG(data, options) {
        // Export chart or dashboard as PNG
        const chartId = options.chartId;
        const dashboardId = options.dashboardId;
        
        let imageData;
        if (chartId) {
            imageData = await this.exportChartToPNG(chartId);
        } else if (dashboardId) {
            imageData = await this.exportDashboardToPNG(dashboardId);
        } else {
            throw new Error('No chart or dashboard specified for PNG export');
        }
        
        return {
            data: imageData,
            mimeType: 'image/png'
        };
    }
    
    /**
     * Export to SVG
     */
    async exportToSVG(data, options) {
        // Export chart as SVG
        const chartId = options.chartId;
        if (!chartId) {
            throw new Error('No chart specified for SVG export');
        }
        
        const svgData = await this.exportChartToSVG(chartId);
        
        return {
            data: svgData,
            mimeType: 'image/svg+xml'
        };
    }
    
    /**
     * Generate PDF content
     */
    generatePDFContent(data, options) {
        // This would generate PDF content using a library like jsPDF
        // For now, return a simple text representation
        return `
# ${data.metadata.title}

## Export Information
- **Description**: ${data.metadata.description}
- **Exported**: ${new Date(data.metadata.timestamp).toLocaleString()}
- **Format**: ${data.metadata.format}
- **Version**: ${data.metadata.version}

## Data Summary
- **Raw Data Rows**: ${data.rawData.length}
- **Processed Data Rows**: ${data.processedData.length}
- **Visualizations**: ${data.visualizations.length}
- **Dashboard Widgets**: ${data.dashboard ? data.dashboard.widgets.length : 0}

## Data Structure
${data.dataStructure ? JSON.stringify(data.dataStructure, null, 2) : 'No structure available'}

## Raw Data Sample
${data.rawData.slice(0, 5).map(row => JSON.stringify(row)).join('\n')}

## Processed Data Sample
${data.processedData.slice(0, 5).map(row => JSON.stringify(row)).join('\n')}
        `;
    }
    
    /**
     * Convert data to Excel sheet format
     */
    convertToSheet(data) {
        if (!data || data.length === 0) {
            return { headers: [], rows: [] };
        }
        
        const headers = Object.keys(data[0]);
        const rows = data.map(row => headers.map(header => row[header]));
        
        return {
            headers: headers,
            rows: rows
        };
    }
    
    /**
     * Generate summary sheet
     */
    generateSummarySheet(data) {
        const summary = {
            'Export Summary': [
                ['Metric', 'Value'],
                ['Total Raw Rows', data.rawData.length],
                ['Total Processed Rows', data.processedData.length],
                ['Number of Columns', data.dataStructure ? Object.keys(data.dataStructure.columns).length : 0],
                ['Number of Visualizations', data.visualizations.length],
                ['Export Date', new Date(data.metadata.timestamp).toLocaleString()]
            ]
        };
        
        return summary;
    }
    
    /**
     * Convert to Excel format
     */
    convertToExcelFormat(workbook) {
        // This would use a library like SheetJS to convert to Excel format
        // For now, return a placeholder
        return new Blob(['Excel data would go here'], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
    }
    
    /**
     * Convert data to CSV format
     */
    convertToCSV(data) {
        if (!data || data.length === 0) {
            return '';
        }
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => 
            headers.map(header => this.escapeCSVValue(row[header])).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }
    
    /**
     * Escape CSV value
     */
    escapeCSVValue(value) {
        if (value === null || value === undefined) {
            return '';
        }
        
        const str = String(value);
        
        // If value contains comma, newline, or quote, wrap in quotes and escape quotes
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        
        return str;
    }
    
    /**
     * Export chart to PNG
     */
    async exportChartToPNG(chartId) {
        // This would use the chart library to export to PNG
        // For now, return a placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.fillText('Chart export would go here', 50, 50);
        
        return canvas.toDataURL('image/png');
    }
    
    /**
     * Export dashboard to PNG
     */
    async exportDashboardToPNG(dashboardId) {
        // This would use a library like html2canvas to capture the dashboard
        // For now, return a placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.fillText('Dashboard export would go here', 50, 50);
        
        return canvas.toDataURL('image/png');
    }
    
    /**
     * Export chart to SVG
     */
    async exportChartToSVG(chartId) {
        // This would convert the chart to SVG format
        // For now, return a placeholder
        return `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
    <text x="50" y="50" font-family="Arial" font-size="20" fill="black">
        Chart SVG export would go here
    </text>
</svg>
        `;
    }
    
    /**
     * Generate filename
     */
    generateFilename(format, options) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const baseName = options.filename || 'excel-analyzer-export';
        const extension = this.exportFormats[format].extension;
        
        return `${baseName}-${timestamp}${extension}`;
    }
    
    /**
     * Trigger file download
     */
    triggerDownload(data, filename, mimeType) {
        const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    
    /**
     * Get export progress
     */
    getExportProgress(current, total) {
        return {
            percentage: Math.round((current / total) * 100),
            current: current,
            total: total,
            message: `Exporting... ${current}/${total} items processed`
        };
    }
    
    /**
     * Validate export options
     */
    validateExportOptions(options) {
        const errors = [];
        
        if (!options.format) {
            errors.push('Export format is required');
        }
        
        if (!this.exportFormats[options.format]) {
            errors.push(`Unsupported export format: ${options.format}`);
        }
        
        if (options.format === 'png' && !options.chartId && !options.dashboardId) {
            errors.push('Chart ID or Dashboard ID is required for PNG export');
        }
        
        if (options.format === 'svg' && !options.chartId) {
            errors.push('Chart ID is required for SVG export');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Get available export formats
     */
    getAvailableFormats() {
        return Object.keys(this.exportFormats).map(format => ({
            id: format,
            ...this.exportFormats[format]
        }));
    }
    
    /**
     * Get export format info
     */
    getFormatInfo(format) {
        return this.exportFormats[format] || null;
    }
    
    /**
     * Batch export multiple items
     */
    async batchExport(items, options = {}) {
        const results = [];
        const totalItems = items.length;
        
        for (let i = 0; i < totalItems; i++) {
            const item = items[i];
            const progress = this.getExportProgress(i + 1, totalItems);
            
            // Notify progress
            if (this.options.onExportProgress) {
                this.options.onExportProgress(progress);
            }
            
            try {
                const result = await this.export(item.format, {
                    ...options,
                    ...item.options,
                    filename: `${options.filename || 'batch-export'}-${i + 1}`
                });
                
                results.push({
                    ...result,
                    item: item,
                    success: true
                });
            } catch (error) {
                results.push({
                    item: item,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    /**
     * Export dashboard with all widgets
     */
    async exportDashboardWithWidgets(dashboardId, format) {
        const dashboard = this.options.dashboardManager.getDashboard(dashboardId);
        if (!dashboard) {
            throw new Error('Dashboard not found');
        }
        
        const exportItems = [{
            format: format,
            options: {
                dashboardId: dashboardId,
                includeCharts: true,
                includeData: true
            }
        }];
        
        // Add individual chart exports if dashboard has charts
        if (dashboard.widgets) {
            dashboard.widgets.forEach(widget => {
                if (widget.chartId) {
                    exportItems.push({
                        format: format,
                        options: {
                            chartId: widget.chartId,
                            filename: `chart-${widget.id}`
                        }
                    });
                }
            });
        }
        
        return await this.batchExport(exportItems);
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Exporter;
} else {
    window.Exporter = Exporter;
}