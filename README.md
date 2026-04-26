# 🖥️ CPU Scheduling Simulator & Lab

An interactive web-based simulator designed to help students visualize and understand various CPU scheduling algorithms. This tool provides real-time Gantt chart generation, step-by-step simulation, and performance comparison.

## ✨ Features
- **Multiple Algorithms:** Supports FCFS, SJF (Preemptive/Non-preemptive), Round Robin, and Priority scheduling.
- **Visual Gantt Charts:** Dynamic, accessible timeline generation with ARIA labels for screen readers.
- **Step-by-Step Simulator:** Visual state indicators (Running, Ready, Waiting) with pulsing animations.
- **Real-time Analytics:** Instant calculation of Turnaround Time (TAT) and Waiting Time (WT).
- **Responsive Design:** Fully optimized for mobile and desktop learning environments.

## 🛠️ Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Deployment:** GitHub Pages via GitHub Actions

## 🔗 Live Demo
Explore the algorithms and run simulations here: 
[Launch CPU Scheduler Lab](https://sai-sri-krishna.github.io/cpu-scheduler-lab/)

## 🕹️ How It Works
1. **Input Processes:** Add processes with their respective Arrival Times and Burst Times.
2. **Select Algorithm:** Choose the scheduling logic you want to visualize.
3. **Analyze:** View the generated Gantt chart and the calculated average waiting and turnaround times.
4. **Simulate:** Use the Simulator mode to watch the CPU move through the process queue in real-time.

## 🚀 Installation
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/Sai-Sri-Krishna/cpu-scheduler-lab.git](https://github.com/Sai-Sri-Krishna/cpu-scheduler-lab.git)
