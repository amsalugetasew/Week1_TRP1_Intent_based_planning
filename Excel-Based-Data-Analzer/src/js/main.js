/**
 * Excel Analyzer - Main Application Entry Point
 * 
 * This file serves as the main entry point for the Excel Analyzer application,
 * initializing all modules and setting up the application state and event handling.
 */

// Application State Management
const appState = {
    currentFile: null,
    rawData: [],
    processedData: [],
    dataStructure: null,
    visualizations: [],
    dashboard: null,
    exportSettings: {
        includeCharts: true,
        includeData: true,
        includeSummary: true
    },
    isProcessing: false,
    theme: 'light'
};

// Module References
const modules = {
    fileUpload: null,
    dataProcessor: null,
    visualizer: null,
    dashboard: null,
    exporter: null
};

// Utility References
const utils = {
    helpers: null,
    validators: null,
    formatters: null
};

const config = {
    settings: null,
    defaults: null,
    themes: null
};

const events = {
    system: null,
    handlers: null
};

/**
 * Application Initialization
 * Sets up all modules, event handlers, and initializes the application
 */
function init() {
    console.log('Excel Analyzer - Initializing application...');
    
    try {
        // Initialize configuration first
        initConfig();
        
        // Initialize utilities
        initUtils();
        
        // Initialize modules
        initModules();
        
        // Set up event handlers
        initEventHandlers();
        
        // Initialize UI
        initUI();
        
        // Load saved state if available
        loadAppState();
        
        console.log('Excel Analyzer - Application initialized successfully');
        
        // Dispatch initialization complete event
        events.system.emit('app:initialized', { timestamp: Date.now() });
        
    } catch (error) {
        console.error('Excel Analyzer - Initialization failed:', error);
        showErrorMessage('Application initialization failed. Please refresh the page and try again.');
    }
}

/**
 * Initialize Configuration Modules
 */
function initConfig() {
    console.log('Initializing configuration...');
    
    // Load settings
    config.settings = new SettingsManager();
    config.defaults = new DefaultValues();
    config.themes = new ThemeManager();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    config.themes.setTheme(savedTheme);
    
    console.log('Configuration initialized');
}

/**
 * Initialize Utility Modules
 */
function initUtils() {
    console.log('Initializing utilities...');
    
    utils.helpers = new Helpers();
    utils.validators = new Validators();
    utils.formatters = new Formatters();
    
    console.log('Utilities initialized');
}

/**
 * Initialize Core Modules
 */
function initModules() {
    console.log('Initializing modules...');
    
    // Initialize file upload module
    modules.fileUpload = new FileUploadManager({
        onFileSelected: handleFileSelected,
        onFileParsed: handleFileParsed,
        onError: handleModuleError
    });
    
    // Initialize data processor module
    modules.dataProcessor = new DataProcessor({
        onDataAnalyzed: handleDataAnalyzed,
        onDataProcessed: handleDataProcessed,
        onError: handleModuleError
    });
    
    // Initialize visualizer module
    modules.visualizer = new Visualizer({
        onChartRendered: handleChartRendered,
        onChartUpdated: handleChartUpdated,
        onError: handleModuleError
    });
    
    // Initialize dashboard module
    modules.dashboard = new DashboardManager({
        onDashboardUpdated: handleDashboardUpdated,
        onWidgetAdded: handleWidgetAdded,
        onError: handleModuleError
    });
    
    // Initialize exporter module
    modules.exporter = new Exporter({
        onExportComplete: handleExportComplete,
        onExportProgress: handleExportProgress,
        onError: handleModuleError
    });
    
    console.log('Modules initialized');
}

/**
 * Initialize Event Handlers
 */
function initEventHandlers() {
    console.log('Initializing event handlers...');
    
    events.system = new EventSystem();
    events.handlers = new EventHandlers({
        appState,
        modules,
        utils,
        config,
        events: events.system
    });
    
    // Set up global event listeners
    setupGlobalEventListeners();
    
    console.log('Event handlers initialized');
}

/**
 * Initialize UI Components
 */
function initUI() {
    console.log('Initializing UI...');
    
    // Hide all sections initially except upload
    hideAllSections();
    showSection('upload');
    
    // Set up navigation
    setupNavigation();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Set up theme toggle
    setupThemeToggle();
    
    console.log('UI initialized');
}

/**
 * Load Saved Application State
 */
function loadAppState() {
    console.log('Loading application state...');
    
    const savedState = localStorage.getItem('excel-analyzer-state');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            Object.assign(appState, state);
            console.log('Application state loaded from localStorage');
        } catch (error) {
            console.warn('Failed to load saved state:', error);
            localStorage.removeItem('excel-analyzer-state');
        }
    }
}

/**
 * Save Application State
 */
function saveAppState() {
    localStorage.setItem('excel-analyzer-state', JSON.stringify(appState));
}

/**
 * Event Handlers
 */

function handleFileSelected(file) {
    console.log('File selected:', file.name);
    appState.currentFile = file;
    appState.rawData = [];
    appState.processedData = [];
    appState.dataStructure = null;
    appState.visualizations = [];
    
    // Update UI
    updateFileInfo(file);
    showSection('preview');
    
    // Save state
    saveAppState();
}

function handleFileParsed(data) {
    console.log('File parsed successfully');
    appState.rawData = data;
    
    // Update UI
    updateDataPreview(data);
    
    // Save state
    saveAppState();
}

function handleDataAnalyzed(structure) {
    console.log('Data analyzed');
    appState.dataStructure = structure;
    
    // Update UI
    updateColumnAnalysis(structure);
    showSection('analyze');
    
    // Save state
    saveAppState();
}

function handleDataProcessed(processedData) {
    console.log('Data processed');
    appState.processedData = processedData;
    
    // Save state
    saveAppState();
}

function handleChartRendered(chart) {
    console.log('Chart rendered');
    appState.visualizations.push(chart);
    
    // Save state
    saveAppState();
}

function handleChartUpdated(chart) {
    console.log('Chart updated');
    const index = appState.visualizations.findIndex(c => c.id === chart.id);
    if (index !== -1) {
        appState.visualizations[index] = chart;
    }
    
    // Save state
    saveAppState();
}

function handleDashboardUpdated(dashboard) {
    console.log('Dashboard updated');
    appState.dashboard = dashboard;
    
    // Save state
    saveAppState();
}

function handleWidgetAdded(widget) {
    console.log('Widget added to dashboard');
    // Dashboard manager handles this internally
    
    // Save state
    saveAppState();
}

function handleExportComplete(result) {
    console.log('Export completed:', result);
    showSuccessMessage(`Export completed successfully: ${result.filename}`);
}

function handleExportProgress(progress) {
    console.log('Export progress:', progress);
    updateExportProgress(progress);
}

function handleModuleError(error) {
    console.error('Module error:', error);
    showErrorMessage(error.message || 'An error occurred. Please try again.');
}

/**
 * UI Helper Functions
 */

function hideAllSections() {
    const sections = ['upload', 'preview', 'analyze', 'dashboard', 'export'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function showSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.style.display = 'block';
        element.classList.add('fade-in');
        
        // Update navigation
        updateNavigationActive(sectionId);
    }
}

function updateNavigationActive(sectionId) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setupNavigation() {
    const links = document.querySelectorAll('.nav-link[data-section]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function setupGlobalEventListeners() {
    // Handle window resize for responsive charts
    window.addEventListener('resize', () => {
        if (modules.visualizer) {
            modules.visualizer.resizeCharts();
        }
    });
    
    // Handle beforeunload to warn about unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (appState.rawData.length > 0) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
}

function setupThemeToggle() {
    // Theme toggle button setup (if implemented)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = config.themes.getCurrentTheme();
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            config.themes.setTheme(newTheme);
            localStorage.setItem('app-theme', newTheme);
        });
    }
}

function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

function updateFileInfo(file) {
    const fileNameEl = document.getElementById('fileName');
    const fileSizeEl = document.getElementById('fileSize');
    
    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = formatFileSize(file.size);
}

function updateDataPreview(data) {
    // Update statistics
    const totalRowsEl = document.getElementById('totalRows');
    const totalColsEl = document.getElementById('totalCols');
    const missingValuesEl = document.getElementById('missingValues');
    const dataQualityEl = document.getElementById('dataQuality');
    
    if (totalRowsEl) totalRowsEl.textContent = data.length;
    if (totalColsEl && data.length > 0) totalColsEl.textContent = Object.keys(data[0]).length;
    
    // Calculate missing values and data quality
    const stats = calculateDataStats(data);
    if (missingValuesEl) missingValuesEl.textContent = stats.missingCount;
    if (dataQualityEl) dataQualityEl.textContent = `${stats.qualityPercentage}%`;
    
    // Update table
    renderDataTable(data);
}

function updateColumnAnalysis(structure) {
    const container = document.getElementById('columnAnalysis');
    if (container && structure) {
        container.innerHTML = generateColumnAnalysisHTML(structure);
    }
}

function updateExportProgress(progress) {
    const progressEl = document.getElementById('exportProgress');
    const progressBarEl = progressEl ? progressEl.querySelector('.progress-bar') : null;
    
    if (progressEl) {
        progressEl.style.display = 'block';
    }
    
    if (progressBarEl) {
        progressBarEl.style.width = `${progress.percentage}%`;
        progressBarEl.textContent = `${progress.percentage}%`;
    }
}

function showSuccessMessage(message) {
    const statusEl = document.getElementById('exportStatus');
    if (statusEl) {
        statusEl.innerHTML = `<div class="alert alert-success">${message}</div>`;
    }
}

function showErrorMessage(message) {
    const statusEl = document.getElementById('uploadStatus') || document.getElementById('exportStatus');
    if (statusEl) {
        statusEl.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
}

function renderDataTable(data) {
    const tableBody = document.getElementById('tableBody');
    const tableHeader = document.getElementById('tableHeader');
    
    if (!tableBody || !tableHeader || data.length === 0) return;
    
    // Generate headers
    const headers = Object.keys(data[0]);
    tableHeader.innerHTML = '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
    
    // Generate rows (limit to first 100 for performance)
    const displayData = data.slice(0, 100);
    tableBody.innerHTML = displayData.map(row => {
        return '<tr>' + headers.map(header => `<td>${row[header] || ''}</td>`).join('') + '</tr>';
    }).join('');
}

function calculateDataStats(data) {
    if (data.length === 0) return { missingCount: 0, qualityPercentage: 100 };
    
    const headers = Object.keys(data[0]);
    let missingCount = 0;
    let totalCount = 0;
    
    data.forEach(row => {
        headers.forEach(header => {
            totalCount++;
            if (row[header] === null || row[header] === undefined || row[header] === '') {
                missingCount++;
            }
        });
    });
    
    const qualityPercentage = Math.round(((totalCount - missingCount) / totalCount) * 100);
    
    return {
        missingCount,
        qualityPercentage
    };
}

function generateColumnAnalysisHTML(structure) {
    if (!structure || !structure.columns) return '';
    
    return structure.columns.map(col => `
        <div class="card mb-2">
            <div class="card-body">
                <h6 class="card-title">${col.name}</h6>
                <p class="card-text">
                    <small class="text-muted">Type: ${col.type}</small><br>
                    <small class="text-muted">Unique Values: ${col.uniqueValues}</small><br>
                    <small class="text-muted">Missing: ${col.missingCount}</small>
                </p>
            </div>
        </div>
    `).join('');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for testing and external access
window.ExcelAnalyzer = {
    appState,
    modules,
    utils,
    config,
    events,
    init,
    saveAppState
};