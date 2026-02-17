/**
 * Settings Manager
 * 
 * Manages application configuration and user preferences.
 */

class SettingsManager {
    constructor() {
        this.defaultSettings = {
            // File Upload Settings
            maxFileSize: 50 * 1024 * 1024, // 50MB
            allowedFileTypes: [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ],
            maxRows: 10000,
            maxColumns: 100,
            
            // Data Processing Settings
            defaultMissingValueHandling: 'remove',
            defaultOutlierHandling: 'remove',
            outlierThreshold: 3,
            autoDetectDataTypes: true,
            enableDataValidation: true,
            
            // Visualization Settings
            defaultChartType: 'auto',
            chartColors: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'],
            chartAnimation: true,
            chartResponsive: true,
            chartLegendPosition: 'top',
            chartTooltip: true,
            
            // Dashboard Settings
            defaultLayout: 'grid',
            maxWidgets: 10,
            enableWidgetResize: true,
            enableWidgetDrag: true,
            autoSaveDashboard: true,
            
            // Export Settings
            defaultExportFormat: 'pdf',
            includeChartsInExport: true,
            includeDataInExport: true,
            includeSummaryInExport: true,
            exportImageQuality: 'high',
            
            // UI Settings
            theme: 'light',
            language: 'en',
            enableTooltips: true,
            enableAnimations: true,
            fontSize: 'medium',
            
            // Performance Settings
            enableVirtualization: true,
            maxPreviewRows: 100,
            enableCaching: true,
            cacheTimeout: 300000, // 5 minutes
            
            // Privacy Settings
            enableAnalytics: false,
            saveUserPreferences: true,
            clearDataOnExit: false
        };
        
        this.settings = this.loadSettings();
    }
    
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('excel-analyzer-settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                return { ...this.defaultSettings, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
        
        return { ...this.defaultSettings };
    }
    
    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('excel-analyzer-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }
    
    /**
     * Get setting value
     */
    get(key, defaultValue = null) {
        return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
    }
    
    /**
     * Set setting value
     */
    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        
        // Emit settings change event
        this.emit('settings:changed', { key, value });
    }
    
    /**
     * Update multiple settings
     */
    update(settings) {
        this.settings = { ...this.settings, ...settings };
        this.saveSettings();
        
        this.emit('settings:updated', settings);
    }
    
    /**
     * Reset settings to defaults
     */
    reset() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        
        this.emit('settings:reset', this.settings);
    }
    
    /**
     * Get all settings
     */
    getAll() {
        return { ...this.settings };
    }
    
    /**
     * Get file upload settings
     */
    getFileUploadSettings() {
        return {
            maxFileSize: this.get('maxFileSize'),
            allowedFileTypes: this.get('allowedFileTypes'),
            maxRows: this.get('maxRows'),
            maxColumns: this.get('maxColumns')
        };
    }
    
    /**
     * Get data processing settings
     */
    getDataProcessingSettings() {
        return {
            defaultMissingValueHandling: this.get('defaultMissingValueHandling'),
            defaultOutlierHandling: this.get('defaultOutlierHandling'),
            outlierThreshold: this.get('outlierThreshold'),
            autoDetectDataTypes: this.get('autoDetectDataTypes'),
            enableDataValidation: this.get('enableDataValidation')
        };
    }
    
    /**
     * Get visualization settings
     */
    getVisualizationSettings() {
        return {
            defaultChartType: this.get('defaultChartType'),
            chartColors: this.get('chartColors'),
            chartAnimation: this.get('chartAnimation'),
            chartResponsive: this.get('chartResponsive'),
            chartLegendPosition: this.get('chartLegendPosition'),
            chartTooltip: this.get('chartTooltip')
        };
    }
    
    /**
     * Get dashboard settings
     */
    getDashboardSettings() {
        return {
            defaultLayout: this.get('defaultLayout'),
            maxWidgets: this.get('maxWidgets'),
            enableWidgetResize: this.get('enableWidgetResize'),
            enableWidgetDrag: this.get('enableWidgetDrag'),
            autoSaveDashboard: this.get('autoSaveDashboard')
        };
    }
    
    /**
     * Get export settings
     */
    getExportSettings() {
        return {
            defaultExportFormat: this.get('defaultExportFormat'),
            includeChartsInExport: this.get('includeChartsInExport'),
            includeDataInExport: this.get('includeDataInExport'),
            includeSummaryInExport: this.get('includeSummaryInExport'),
            exportImageQuality: this.get('exportImageQuality')
        };
    }
    
    /**
     * Get UI settings
     */
    getUISettings() {
        return {
            theme: this.get('theme'),
            language: this.get('language'),
            enableTooltips: this.get('enableTooltips'),
            enableAnimations: this.get('enableAnimations'),
            fontSize: this.get('fontSize')
        };
    }
    
    /**
     * Get performance settings
     */
    getPerformanceSettings() {
        return {
            enableVirtualization: this.get('enableVirtualization'),
            maxPreviewRows: this.get('maxPreviewRows'),
            enableCaching: this.get('enableCaching'),
            cacheTimeout: this.get('cacheTimeout')
        };
    }
    
    /**
     * Get privacy settings
     */
    getPrivacySettings() {
        return {
            enableAnalytics: this.get('enableAnalytics'),
            saveUserPreferences: this.get('saveUserPreferences'),
            clearDataOnExit: this.get('clearDataOnExit')
        };
    }
    
    /**
     * Validate settings
     */
    validateSettings(settings) {
        const errors = [];
        
        // Validate file size
        if (settings.maxFileSize && settings.maxFileSize < 1024) {
            errors.push('maxFileSize must be at least 1KB');
        }
        
        // Validate max rows
        if (settings.maxRows && (settings.maxRows < 1 || settings.maxRows > 100000)) {
            errors.push('maxRows must be between 1 and 100000');
        }
        
        // Validate max columns
        if (settings.maxColumns && (settings.maxColumns < 1 || settings.maxColumns > 1000)) {
            errors.push('maxColumns must be between 1 and 1000');
        }
        
        // Validate outlier threshold
        if (settings.outlierThreshold && settings.outlierThreshold < 1) {
            errors.push('outlierThreshold must be at least 1');
        }
        
        // Validate cache timeout
        if (settings.cacheTimeout && settings.cacheTimeout < 1000) {
            errors.push('cacheTimeout must be at least 1000ms');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Export settings
     */
    exportSettings() {
        return {
            version: '1.0',
            timestamp: Date.now(),
            settings: this.getAll()
        };
    }
    
    /**
     * Import settings
     */
    importSettings(importData) {
        if (!importData || !importData.settings) {
            throw new Error('Invalid settings data');
        }
        
        const validation = this.validateSettings(importData.settings);
        if (!validation.isValid) {
            throw new Error('Invalid settings: ' + validation.errors.join(', '));
        }
        
        this.update(importData.settings);
    }
    
    /**
     * Event system for settings changes
     */
    constructor() {
        this.defaultSettings = {
            // File Upload Settings
            maxFileSize: 50 * 1024 * 1024, // 50MB
            allowedFileTypes: [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ],
            maxRows: 10000,
            maxColumns: 100,
            
            // Data Processing Settings
            defaultMissingValueHandling: 'remove',
            defaultOutlierHandling: 'remove',
            outlierThreshold: 3,
            autoDetectDataTypes: true,
            enableDataValidation: true,
            
            // Visualization Settings
            defaultChartType: 'auto',
            chartColors: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'],
            chartAnimation: true,
            chartResponsive: true,
            chartLegendPosition: 'top',
            chartTooltip: true,
            
            // Dashboard Settings
            defaultLayout: 'grid',
            maxWidgets: 10,
            enableWidgetResize: true,
            enableWidgetDrag: true,
            autoSaveDashboard: true,
            
            // Export Settings
            defaultExportFormat: 'pdf',
            includeChartsInExport: true,
            includeDataInExport: true,
            includeSummaryInExport: true,
            exportImageQuality: 'high',
            
            // UI Settings
            theme: 'light',
            language: 'en',
            enableTooltips: true,
            enableAnimations: true,
            fontSize: 'medium',
            
            // Performance Settings
            enableVirtualization: true,
            maxPreviewRows: 100,
            enableCaching: true,
            cacheTimeout: 300000, // 5 minutes
            
            // Privacy Settings
            enableAnalytics: false,
            saveUserPreferences: true,
            clearDataOnExit: false
        };
        
        this.settings = this.loadSettings();
        this.listeners = {};
    }
    
    /**
     * Add event listener
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    /**
     * Remove event listener
     */
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
    
    /**
     * Emit event
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in settings event listener:', error);
                }
            });
        }
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
} else {
    window.SettingsManager = SettingsManager;
}