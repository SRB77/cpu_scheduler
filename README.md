# 🖥️ CPU Scheduling Algorithm Simulator

A modern, interactive web application for visualizing and understanding CPU scheduling algorithms. Built as an educational tool for Operating Systems courses, this simulator helps students grasp how different scheduling algorithms work through real-time Gantt chart visualization and performance metrics.



## ✨ Features

### 🔄 Scheduling Algorithms
- **FCFS (First Come First Serve)** - Non-preemptive, processes executed in arrival order
- **SJF (Shortest Job First)** - Non-preemptive, shortest burst time executed first
- **SRTF (Shortest Remaining Time First)** - Preemptive version of SJF
- **Priority Scheduling** - Non-preemptive, highest priority (lowest number) first
- **Round Robin** - Preemptive, time-quantum based circular scheduling

### 📊 Visualization & Metrics
- **Interactive Gantt Chart** - Color-coded timeline showing process execution
- **Performance Metrics Table** - Displays for each process:
  - Waiting Time
  - Turnaround Time
  - Completion Time

### 🎨 User Experience
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Random Process Generator** - Quickly generate test processes
- **URL State Sharing** - Share your simulation setup via URL
- **Toast Notifications** - Real-time feedback on actions
- **Smooth Animations** - Built with Framer Motion

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SRB77/cpu_scheduler.git
   cd cpu_scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
cpuvisualiser/
├── src/
│   ├── algorithms/          # Scheduling algorithm implementations
│   │   ├── fcfs.ts          # First Come First Serve
│   │   ├── sjf.ts           # Shortest Job First
│   │   ├── srtf.ts          # Shortest Remaining Time First
│   │   ├── priority.ts      # Priority Scheduling
│   │   └── roundRobin.ts    # Round Robin
│   │
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components (Button, Card, Input, etc.)
│   │   ├── AlgorithmSelector.tsx
│   │   ├── GanttChart.tsx   # Gantt chart visualization
│   │   ├── MetricsTable.tsx # Performance metrics display
│   │   ├── ProcessForm.tsx  # Add/edit process form
│   │   ├── ProcessTable.tsx # Process list display
│   │   ├── RandomGenerator.tsx
│   │   └── ShareButton.tsx
│   │
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx # Dark/Light theme management
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── process.ts       # Process, GanttBlock, Metrics interfaces
│   │
│   ├── utils/               # Utility functions
│   │   ├── cn.ts            # Classname utility
│   │   ├── colors.ts        # Color generation
│   │   └── urlState.ts      # URL state management
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🎯 How to Use

1. **Add Processes**
   - Enter Process ID, Arrival Time, and Burst Time
   - For Priority algorithm, also enter Priority value (lower = higher priority)
   - Click "Add Process" to add to the queue

2. **Select Algorithm**
   - Choose from FCFS, SJF, SRTF, Priority, or Round Robin
   - For Round Robin, set the Time Quantum value

3. **Run Simulation**
   - Click "Run Simulation" to execute the algorithm
   - View the Gantt Chart for visual representation
   - Check the Metrics Table for performance statistics

4. **Additional Features**
   - Use "Random Generate" for quick testing
   - Use "Share" to copy the URL with your current setup
   - Toggle theme using the sun/moon icon
   - Edit or delete processes from the table

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **React Toastify** | Notifications |

## 📚 Algorithm Details

### FCFS (First Come First Serve)
- **Type:** Non-preemptive
- **Logic:** Processes are executed in order of their arrival time
- **Pros:** Simple to implement
- **Cons:** Can cause convoy effect (long processes block short ones)

### SJF (Shortest Job First)
- **Type:** Non-preemptive
- **Logic:** Process with shortest burst time is selected next
- **Pros:** Optimal average waiting time
- **Cons:** Potential starvation for long processes

### SRTF (Shortest Remaining Time First)
- **Type:** Preemptive
- **Logic:** Process with shortest remaining time runs
- **Pros:** Lower average waiting time than SJF
- **Cons:** Higher overhead due to frequent context switches

### Priority Scheduling
- **Type:** Non-preemptive
- **Logic:** Process with highest priority (lowest number) runs first
- **Pros:** Important processes get CPU first
- **Cons:** Starvation possible for low priority processes

### Round Robin
- **Type:** Preemptive
- **Logic:** Each process gets a fixed time quantum in circular order
- **Pros:** Fair allocation, no starvation
- **Cons:** Performance depends on quantum selection

## 👥 Contributors

- **Soumya Ranjan** - [@SRB77](https://github.com/SRB77)
- **Prashant** - [@nox-pie](https://github.com/nox-pie)