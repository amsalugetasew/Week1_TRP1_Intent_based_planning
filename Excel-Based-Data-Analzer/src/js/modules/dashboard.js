/**
 * Dashboard Module
 * 
 * Manages dashboard layout, widgets, and interactive dashboard functionality.
 */

class Dashboard {
    constructor(options = {}) {
        this.options = options;
        this.widgets = [];
        this.layout = 'grid';
        this.gridColumns = 12;
        this.gridRows = 12;
        this.widgetMargin = 10;
        this.isEditing = false;
        
        this.init();
    }
    
    init() {
        this.dashboardContainer = document.getElementById('dashboardContainer');
        if (!this.dashboardContainer) {
            throw new Error('Dashboard container not found');
        }
        
        this.setupDashboard();
    }
    
    setupDashboard() {
        // Setup dashboard controls
        this.setupControls();
        
        // Setup drag and drop
        this.setupDragAndDrop();
        
        // Setup resize handlers
        this.setupResizeHandlers();
        
        // Load saved dashboard
        this.loadDashboard();
    }
    
    /**
     * Setup dashboard controls
     */
    setupControls() {
        const controls = document.getElementById('dashboardControls');
        if (!controls) return;
        
        // Layout buttons
        const layoutButtons = controls.querySelectorAll('.btn[data-layout]');
        layoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const layout = e.target.getAttribute('data-layout');
                this.setLayout(layout);
            });
        });
        
        // Edit mode toggle
        const editToggle = controls.querySelector('#editModeToggle');
        if (editToggle) {
            editToggle.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }
        
        // Save dashboard
        const saveBtn = controls.querySelector('#saveDashboardBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.save();
            });
        }
        
        // Clear dashboard
        const clearBtn = controls.querySelector('#clearDashboardBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clear();
            });
        }
    }
    
    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        // Make widgets draggable
        this.dashboardContainer.addEventListener('dragstart', (e) => {
            if (!this.isEditing || !e.target.classList.contains('dashboard-widget')) {
                return;
            }
            e.dataTransfer.setData('text/plain', e.target.dataset.widgetId);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        this.dashboardContainer.addEventListener('dragover', (e) => {
            if (!this.isEditing) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        this.dashboardContainer.addEventListener('drop', (e) => {
            if (!this.isEditing) return;
            e.preventDefault();
            
            const widgetId = e.dataTransfer.getData('text/plain');
            const target = e.target.closest('.dashboard-widget');
            
            if (target && target.dataset.widgetId !== widgetId) {
                this.reorderWidgets(widgetId, target.dataset.widgetId);
            }
        });
    }
    
    /**
     * Setup resize handlers
     */
    setupResizeHandlers() {
        this.dashboardContainer.addEventListener('mousedown', (e) => {
            if (!this.isEditing || !e.target.classList.contains('resize-handle')) {
                return;
            }
            
            const widget = e.target.closest('.dashboard-widget');
            this.startResize(widget, e);
        });
    }
    
    /**
     * Start widget resize
     */
    startResize(widget, event) {
        const initialWidth = widget.offsetWidth;
        const initialHeight = widget.offsetHeight;
        const initialX = event.clientX;
        const initialY = event.clientY;
        
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - initialX;
            const deltaY = e.clientY - initialY;
            
            const newWidth = Math.max(100, initialWidth + deltaX);
            const newHeight = Math.max(100, initialHeight + deltaY);
            
            widget.style.width = `${newWidth}px`;
            widget.style.height = `${newHeight}px`;
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // Snap to grid
            this.snapToGrid(widget);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    /**
     * Snap widget to grid
     */
    snapToGrid(widget) {
        const rect = widget.getBoundingClientRect();
        const gridUnit = 10; // 10px grid units
        
        const newWidth = Math.round(rect.width / gridUnit) * gridUnit;
        const newHeight = Math.round(rect.height / gridUnit) * gridUnit;
        
        widget.style.width = `${newWidth}px`;
        widget.style.height = `${newHeight}px`;
    }
    
    /**
     * Add widget to dashboard
     */
    addWidget(widgetConfig) {
        const widget = this.createWidget(widgetConfig);
        this.widgets.push(widget);
        this.dashboardContainer.appendChild(widget.element);
        
        // Notify addition
        if (this.options.onWidgetAdded) {
            this.options.onWidgetAdded(widget);
        }
        
        // Save state
        this.save();
        
        return widget;
    }
    
    /**
     * Create widget element
     */
    createWidget(config) {
        const widget = document.createElement('div');
        widget.className = 'dashboard-widget';
        widget.dataset.widgetId = config.id || this.generateId();
        widget.dataset.widgetType = config.type;
        
        // Set initial position and size
        widget.style.width = `${config.width || 300}px`;
        widget.style.height = `${config.height || 200}px`;
        widget.style.left = `${config.x || 0}px`;
        widget.style.top = `${config.y || 0}px`;
        
        // Add content
        widget.innerHTML = `
            <div class="widget-header">
                <h6 class="widget-title">${config.title || 'Widget'}</h6>
                <div class="widget-actions">
                    <button class="btn btn-sm btn-outline-secondary widget-edit-btn" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary widget-remove-btn" title="Remove">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
            <div class="widget-content">
                ${config.content || '<p>Widget content goes here</p>'}
            </div>
            ${this.isEditing ? '<div class="resize-handle"></div>' : ''}
        `;
        
        // Add event listeners
        this.setupWidgetEvents(widget);
        
        return {
            id: widget.dataset.widgetId,
            type: config.type,
            element: widget,
            config: config
        };
    }
    
    /**
     * Setup widget events
     */
    setupWidgetEvents(widget) {
        // Edit button
        const editBtn = widget.querySelector('.widget-edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.editWidget(widget);
            });
        }
        
        // Remove button
        const removeBtn = widget.querySelector('.widget-remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.removeWidget(widget.dataset.widgetId);
            });
        }
    }
    
    /**
     * Edit widget
     */
    editWidget(widget) {
        const widgetId = widget.dataset.widgetId;
        const currentConfig = this.widgets.find(w => w.id === widgetId)?.config;
        
        // Create edit modal
        const modal = this.createEditModal(currentConfig, (newConfig) => {
            this.updateWidget(widgetId, newConfig);
        });
        
        modal.show();
    }
    
    /**
     * Update widget
     */
    updateWidget(widgetId, newConfig) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;
        
        // Update widget element
        const element = widget.element;
        const header = element.querySelector('.widget-title');
        const content = element.querySelector('.widget-content');
        
        if (header) header.textContent = newConfig.title || 'Widget';
        if (content) content.innerHTML = newConfig.content || content.innerHTML;
        
        // Update config
        widget.config = { ...widget.config, ...newConfig };
        
        // Save state
        this.save();
    }
    
    /**
     * Remove widget
     */
    removeWidget(widgetId) {
        const widgetIndex = this.widgets.findIndex(w => w.id === widgetId);
        if (widgetIndex === -1) return;
        
        const widget = this.widgets[widgetIndex];
        widget.element.remove();
        this.widgets.splice(widgetIndex, 1);
        
        // Save state
        this.save();
    }
    
    /**
     * Reorder widgets
     */
    reorderWidgets(sourceId, targetId) {
        const sourceIndex = this.widgets.findIndex(w => w.id === sourceId);
        const targetIndex = this.widgets.findIndex(w => w.id === targetId);
        
        if (sourceIndex === -1 || targetIndex === -1) return;
        
        const [widget] = this.widgets.splice(sourceIndex, 1);
        this.widgets.splice(targetIndex, 0, widget);
        
        // Re-append in new order
        this.widgets.forEach(w => {
            this.dashboardContainer.appendChild(w.element);
        });
        
        // Save state
        this.save();
    }
    
    /**
     * Set dashboard layout
     */
    setLayout(layout) {
        this.layout = layout;
        this.dashboardContainer.className = `dashboard-container dashboard-${layout}`;
        
        // Update widget positions based on layout
        this.updateLayoutPositions();
        
        // Save state
        this.save();
        
        // Notify update
        if (this.options.onDashboardUpdated) {
            this.options.onDashboardUpdated({
                layout: this.layout,
                widgets: this.widgets.map(w => w.config)
            });
        }
    }
    
    /**
     * Update widget positions based on layout
     */
    updateLayoutPositions() {
        if (this.layout === 'grid') {
            this.arrangeGridLayout();
        } else if (this.layout === 'vertical') {
            this.arrangeVerticalLayout();
        } else if (this.layout === 'horizontal') {
            this.arrangeHorizontalLayout();
        }
    }
    
    /**
     * Arrange widgets in grid layout
     */
    arrangeGridLayout() {
        let currentRow = 0;
        let currentCol = 0;
        let rowHeight = 0;
        
        this.widgets.forEach(widget => {
            const element = widget.element;
            const widgetWidth = parseInt(element.style.width) || 300;
            const widgetHeight = parseInt(element.style.height) || 200;
            
            // Calculate grid position
            const gridX = currentCol * (widgetWidth + this.widgetMargin);
            const gridY = currentRow * (rowHeight + this.widgetMargin);
            
            element.style.left = `${gridX}px`;
            element.style.top = `${gridY}px`;
            
            // Update layout variables
            currentCol++;
            rowHeight = Math.max(rowHeight, widgetHeight);
            
            // Move to next row if needed
            if (currentCol * (widgetWidth + this.widgetMargin) > this.dashboardContainer.offsetWidth) {
                currentRow++;
                currentCol = 0;
                rowHeight = widgetHeight;
            }
        });
    }
    
    /**
     * Arrange widgets in vertical layout
     */
    arrangeVerticalLayout() {
        let currentY = 0;
        
        this.widgets.forEach(widget => {
            const element = widget.element;
            const widgetHeight = parseInt(element.style.height) || 200;
            
            element.style.left = '0px';
            element.style.top = `${currentY}px`;
            element.style.width = '100%';
            
            currentY += widgetHeight + this.widgetMargin;
        });
    }
    
    /**
     * Arrange widgets in horizontal layout
     */
    arrangeHorizontalLayout() {
        let currentX = 0;
        
        this.widgets.forEach(widget => {
            const element = widget.element;
            const widgetWidth = parseInt(element.style.width) || 300;
            
            element.style.left = `${currentX}px`;
            element.style.top = '0px';
            element.style.height = '100%';
            
            currentX += widgetWidth + this.widgetMargin;
        });
    }
    
    /**
     * Toggle edit mode
     */
    toggleEditMode() {
        this.isEditing = !this.isEditing;
        
        // Update UI
        const editToggle = document.getElementById('editModeToggle');
        if (editToggle) {
            editToggle.classList.toggle('active', this.isEditing);
            editToggle.innerHTML = this.isEditing ? 
                '<i class="bi bi-check2"></i> Done Editing' : 
                '<i class="bi bi-pencil"></i> Edit Mode';
        }
        
        // Update widget resize handles
        this.widgets.forEach(widget => {
            if (this.isEditing) {
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'resize-handle';
                widget.element.appendChild(resizeHandle);
            } else {
                const resizeHandle = widget.element.querySelector('.resize-handle');
                if (resizeHandle) resizeHandle.remove();
            }
        });
    }
    
    /**
     * Handle dashboard resize
     */
    handleResize() {
        // Recalculate widget positions for current layout
        this.updateLayoutPositions();
    }
    
    /**
     * Update theme
     */
    updateTheme(theme) {
        // Update dashboard theme classes
        this.dashboardContainer.classList.remove('theme-light', 'theme-dark', 'theme-blue');
        this.dashboardContainer.classList.add(`theme-${theme}`);
        
        // Update widget themes
        this.widgets.forEach(widget => {
            const element = widget.element;
            element.classList.remove('theme-light', 'theme-dark', 'theme-blue');
            element.classList.add(`theme-${theme}`);
        });
    }
    
    /**
     * Save dashboard state
     */
    save() {
        const dashboardState = {
            layout: this.layout,
            widgets: this.widgets.map(w => ({
                id: w.id,
                type: w.type,
                config: w.config,
                position: {
                    x: parseInt(w.element.style.left) || 0,
                    y: parseInt(w.element.style.top) || 0,
                    width: parseInt(w.element.style.width) || 300,
                    height: parseInt(w.element.style.height) || 200
                }
            })),
            timestamp: Date.now()
        };
        
        localStorage.setItem('excel-analyzer-dashboard', JSON.stringify(dashboardState));
        
        // Notify save
        if (this.options.onDashboardUpdated) {
            this.options.onDashboardUpdated(dashboardState);
        }
    }
    
    /**
     * Load dashboard state
     */
    loadDashboard() {
        const savedState = localStorage.getItem('excel-analyzer-dashboard');
        if (!savedState) return;
        
        try {
            const state = JSON.parse(savedState);
            
            // Set layout
            this.setLayout(state.layout || 'grid');
            
            // Create widgets
            state.widgets.forEach(widgetData => {
                const widget = this.createWidget(widgetData.config);
                this.widgets.push(widget);
                this.dashboardContainer.appendChild(widget.element);
                
                // Set position
                const element = widget.element;
                const pos = widgetData.position;
                element.style.left = `${pos.x}px`;
                element.style.top = `${pos.y}px`;
                element.style.width = `${pos.width}px`;
                element.style.height = `${pos.height}px`;
            });
            
        } catch (error) {
            console.warn('Failed to load dashboard state:', error);
            localStorage.removeItem('excel-analyzer-dashboard');
        }
    }
    
    /**
     * Clear dashboard
     */
    clear() {
        this.widgets.forEach(widget => {
            widget.element.remove();
        });
        this.widgets = [];
        
        // Save empty state
        this.save();
    }
    
    /**
     * Create edit modal
     */
    createEditModal(config, onSave) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Widget</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="widgetForm">
                            <div class="mb-3">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" name="title" value="${config.title || ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Content</label>
                                <textarea class="form-control" name="content" rows="4">${config.content || ''}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveWidgetBtn">Save</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const saveBtn = modal.querySelector('#saveWidgetBtn');
        saveBtn.addEventListener('click', () => {
            const form = modal.querySelector('#widgetForm');
            const formData = new FormData(form);
            const newConfig = {
                title: formData.get('title'),
                content: formData.get('content')
            };
            
            onSave(newConfig);
            modal.remove();
        });
        
        // Initialize Bootstrap modal
        const bootstrapModal = new bootstrap.Modal(modal);
        return bootstrapModal;
    }
    
    /**
     * Generate unique ID
     */
    generateId() {
        return 'widget-' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Get dashboard statistics
     */
    getDashboardStats() {
        return {
            totalWidgets: this.widgets.length,
            layout: this.layout,
            isEditing: this.isEditing,
            widgetsByType: this.widgets.reduce((acc, widget) => {
                acc[widget.type] = (acc[widget.type] || 0) + 1;
                return acc;
            }, {})
        };
    }
    
    /**
     * Export dashboard
     */
    exportDashboard() {
        const dashboardData = {
            layout: this.layout,
            widgets: this.widgets.map(w => ({
                id: w.id,
                type: w.type,
                config: w.config,
                position: {
                    x: parseInt(w.element.style.left) || 0,
                    y: parseInt(w.element.style.top) || 0,
                    width: parseInt(w.element.style.width) || 300,
                    height: parseInt(w.element.style.height) || 200
                }
            })),
            exportedAt: new Date().toISOString()
        };
        
        return dashboardData;
    }
    
    /**
     * Import dashboard
     */
    importDashboard(dashboardData) {
        this.clear();
        
        this.setLayout(dashboardData.layout || 'grid');
        
        dashboardData.widgets.forEach(widgetData => {
            const widget = this.createWidget(widgetData.config);
            this.widgets.push(widget);
            this.dashboardContainer.appendChild(widget.element);
            
            const element = widget.element;
            const pos = widgetData.position;
            element.style.left = `${pos.x}px`;
            element.style.top = `${pos.y}px`;
            element.style.width = `${pos.width}px`;
            element.style.height = `${pos.height}px`;
        });
        
        this.save();
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
} else {
    window.Dashboard = Dashboard;
}