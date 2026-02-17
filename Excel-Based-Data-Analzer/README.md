# Excel Analyzer Project

A web-based application for analyzing Excel files with interactive dashboards and export capabilities.

## Project Overview

This project provides a comprehensive Excel analysis solution that allows users to upload Excel files, perform data preprocessing, visualize insights, and export results in multiple formats.

## Features

- **File Upload**: Accept Excel files (.xlsx, .xls) from users
- **Data Observation**: View and explore uploaded data
- **Preprocessing**: Handle missing values, outliers, and data cleaning
- **Visualization**: Create interactive charts and graphs
- **Dashboard**: User-friendly interface for data exploration
- **Export**: Download results as PDF or Excel files

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Data Processing**: SheetJS (xlsx.js) for Excel parsing
- **Visualization**: Chart.js for interactive charts
- **PDF Export**: jsPDF for PDF generation
- **File Handling**: HTML5 File API

## Project Structure

```
Week1_TRP1_Intent_based_planning/
├── README.md
├── specification.md
├── constitution.md
├── plan.md
├── architecture.md
├── project_structure.md
├── src/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   ├── data-processor.js
│   │   ├── visualizer.js
│   │   ├── dashboard.js
│   │   └── exporter.js
│   └── assets/
│       └── images/
├── docs/
│   ├── user-guide.md
│   └── api-docs.md
└── tests/
    └── test-suite.html
```

## Quick Start

1. Clone or download this project
2. Open `src/index.html` in a web browser
3. Upload an Excel file to begin analysis
4. Explore the interactive dashboard and export results

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the [MIT License](LICENSE).