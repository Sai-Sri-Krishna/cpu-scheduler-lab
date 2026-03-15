"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Zap, Timer, BarChart3, Play, Pause, Volume2, Video, Headphones, ArrowRight, ArrowDown, RotateCcw, Cpu, GitBranch } from "lucide-react"

interface Algorithm {
  id: string
  name: string
  fullName: string
  icon: React.ElementType
  color: string
  definition: string
  steps: string[]
  advantages: string[]
  disadvantages: string[]
  realWorld: string
  processes: { id: string; arrival: number; burst: number; priority?: number }[]
  ganttExample: { process: string; start: number; end: number }[]
  videoId: string
  videoTitle: string
  audioScript: string
  flowSteps: { label: string; description: string; type: "start" | "process" | "decision" | "end" }[]
}

const algorithms: Algorithm[] = [
  {
    id: "fcfs",
    name: "FCFS",
    fullName: "First Come First Serve",
    icon: Clock,
    color: "bg-blue-500",
    definition: "FCFS is the simplest CPU scheduling algorithm where processes are executed in the order they arrive in the ready queue. It is non-preemptive, meaning once a process starts executing, it runs to completion.",
    steps: [
      "Processes are placed in a queue as they arrive",
      "The CPU executes the first process in the queue",
      "Once the process completes, the next process in queue begins",
      "This continues until all processes are executed",
      "No preemption occurs - processes run to completion"
    ],
    advantages: [
      "Simple to understand and implement",
      "No starvation - every process eventually gets CPU time",
      "Fair scheduling - processes served in arrival order",
      "Low scheduling overhead"
    ],
    disadvantages: [
      "Convoy effect - short processes wait behind long ones",
      "High average waiting time for short processes",
      "Not suitable for time-sharing systems",
      "No priority handling"
    ],
    realWorld: "FCFS is used in batch systems where job completion time is more important than response time. It's also used in printer queues and simple embedded systems.",
    processes: [
      { id: "P1", arrival: 0, burst: 5 },
      { id: "P2", arrival: 1, burst: 3 },
      { id: "P3", arrival: 2, burst: 5 },
    ],
    ganttExample: [
      { process: "P1", start: 0, end: 5 },
      { process: "P2", start: 5, end: 8 },
      { process: "P3", start: 8, end: 13 },
    ],
    videoId: "WYo1SpUh9FI",
    videoTitle: "FCFS CPU Scheduling Algorithm",
    audioScript: "First Come First Serve, or FCFS, is the simplest CPU scheduling algorithm. Think of it like a queue at a bank - whoever arrives first gets served first. When processes arrive in the ready queue, they're executed in the exact order of their arrival. This is a non-preemptive algorithm, meaning once a process starts executing, it runs until completion without interruption. The main advantage is its simplicity and fairness - every process eventually gets CPU time. However, it suffers from the convoy effect, where short processes stuck behind long ones experience significant waiting times. FCFS is commonly used in batch processing systems and print job queues where response time isn't critical.",
    flowSteps: [
      { label: "Start", description: "Process arrives", type: "start" },
      { label: "Add to Queue", description: "Place at end of ready queue", type: "process" },
      { label: "CPU Free?", description: "Check if CPU is available", type: "decision" },
      { label: "Execute", description: "Run process to completion", type: "process" },
      { label: "Complete", description: "Process terminates", type: "end" }
    ]
  },
  {
    id: "sjf-np",
    name: "SJF Non-Preemptive",
    fullName: "Shortest Job First (Non-Preemptive)",
    icon: Zap,
    color: "bg-emerald-500",
    definition: "SJF Non-Preemptive selects the process with the shortest burst time from the ready queue. Once a process starts, it runs to completion without interruption.",
    steps: [
      "When CPU becomes free, examine all processes in ready queue",
      "Select the process with the smallest burst time",
      "Execute the selected process to completion",
      "If there's a tie, use FCFS for tie-breaking",
      "Repeat until all processes complete"
    ],
    advantages: [
      "Minimizes average waiting time",
      "Optimal for batch systems",
      "Better throughput than FCFS",
      "Efficient CPU utilization"
    ],
    disadvantages: [
      "Requires knowing burst time in advance",
      "Long processes may starve",
      "Not practical for interactive systems",
      "Difficult to predict burst times accurately"
    ],
    realWorld: "Used in specialized batch processing systems where job lengths are known in advance, such as scientific computing clusters and print job scheduling.",
    processes: [
      { id: "P1", arrival: 0, burst: 5 },
      { id: "P2", arrival: 1, burst: 3 },
      { id: "P3", arrival: 2, burst: 5 },
    ],
    ganttExample: [
      { process: "P1", start: 0, end: 5 },
      { process: "P2", start: 5, end: 8 },
      { process: "P3", start: 8, end: 13 },
    ],
    videoId: "pYO-FAg-TpQ",
    videoTitle: "SJF Non-Preemptive Scheduling",
    audioScript: "Shortest Job First Non-Preemptive scheduling prioritizes processes with the shortest burst time. When the CPU becomes available, the scheduler examines all processes in the ready queue and selects the one with the smallest burst time. Once selected, the process runs to completion without interruption - that's what makes it non-preemptive. This algorithm is proven to give the minimum average waiting time among all non-preemptive algorithms. However, it has a significant drawback: it requires knowing the burst time in advance, which is often impossible to predict accurately. Additionally, longer processes may starve if shorter ones keep arriving. It's commonly used in batch systems where job lengths are known beforehand.",
    flowSteps: [
      { label: "Start", description: "Process arrives", type: "start" },
      { label: "Add to Queue", description: "Place in ready queue", type: "process" },
      { label: "CPU Free?", description: "Check if CPU is available", type: "decision" },
      { label: "Find Shortest", description: "Select process with minimum burst time", type: "process" },
      { label: "Execute", description: "Run to completion", type: "process" },
      { label: "Complete", description: "Process terminates", type: "end" }
    ]
  },
  {
    id: "sjf-p",
    name: "SJF Preemptive",
    fullName: "Shortest Remaining Time First (SRTF)",
    icon: Zap,
    color: "bg-teal-500",
    definition: "SRTF is the preemptive version of SJF. When a new process arrives with a shorter remaining time than the current process, the CPU preempts and switches to the new process.",
    steps: [
      "When a new process arrives, compare its burst time with remaining time of current process",
      "If new process has shorter burst time, preempt current process",
      "Add preempted process back to ready queue with remaining burst time",
      "Always execute the process with shortest remaining time",
      "Continue until all processes complete"
    ],
    advantages: [
      "Optimal average waiting time",
      "Better response time for short processes",
      "More efficient than non-preemptive SJF",
      "Good for interactive systems"
    ],
    disadvantages: [
      "Higher context switching overhead",
      "Long processes may starve severely",
      "Requires accurate burst time estimation",
      "Complex to implement"
    ],
    realWorld: "Used in real-time systems where quick response to short tasks is critical, such as embedded control systems and priority-based task schedulers.",
    processes: [
      { id: "P1", arrival: 0, burst: 5 },
      { id: "P2", arrival: 1, burst: 3 },
      { id: "P3", arrival: 2, burst: 5 },
    ],
    ganttExample: [
      { process: "P1", start: 0, end: 1 },
      { process: "P2", start: 1, end: 4 },
      { process: "P1", start: 4, end: 8 },
      { process: "P3", start: 8, end: 13 },
    ],
    videoId: "_QcX99B-zbU",
    videoTitle: "SJF Preemptive Scheduling",
    audioScript: "Shortest Remaining Time First, also known as Preemptive SJF, is an enhancement over the non-preemptive version. The key difference is preemption - when a new process arrives with a burst time shorter than the remaining time of the currently executing process, the scheduler immediately switches to the new process. The preempted process is placed back in the ready queue with its remaining burst time. This algorithm achieves the optimal average waiting time among all scheduling algorithms. However, it comes with increased overhead due to frequent context switches and can cause severe starvation for longer processes. It's particularly useful in interactive systems where quick response to short tasks is essential.",
    flowSteps: [
      { label: "Start", description: "Process arrives", type: "start" },
      { label: "Compare", description: "Compare with running process", type: "decision" },
      { label: "Shorter?", description: "New burst < remaining time?", type: "decision" },
      { label: "Preempt", description: "Switch to new process", type: "process" },
      { label: "Execute", description: "Run shortest remaining", type: "process" },
      { label: "Complete", description: "Process terminates", type: "end" }
    ]
  },
  {
    id: "rr",
    name: "Round Robin",
    fullName: "Round Robin Scheduling",
    icon: Timer,
    color: "bg-amber-500",
    definition: "Round Robin assigns a fixed time quantum to each process. Processes are executed in circular order, with each getting equal CPU time before being moved to the back of the queue if not complete.",
    steps: [
      "Set a fixed time quantum (e.g., 2ms)",
      "Execute the first process in queue for one quantum",
      "If process completes within quantum, move to next process",
      "If process doesn't complete, move it to end of queue",
      "Continue cycling through queue until all complete"
    ],
    advantages: [
      "Fair CPU allocation to all processes",
      "No starvation",
      "Good response time for interactive systems",
      "Simple to implement"
    ],
    disadvantages: [
      "Performance depends on quantum size",
      "High context switching with small quantum",
      "Poor for processes with varying burst times",
      "Average waiting time can be high"
    ],
    realWorld: "Widely used in time-sharing systems, modern operating systems for interactive users, and network packet scheduling (weighted fair queuing).",
    processes: [
      { id: "P1", arrival: 0, burst: 5 },
      { id: "P2", arrival: 1, burst: 3 },
      { id: "P3", arrival: 2, burst: 5 },
    ],
    ganttExample: [
      { process: "P1", start: 0, end: 2 },
      { process: "P2", start: 2, end: 4 },
      { process: "P3", start: 4, end: 6 },
      { process: "P1", start: 6, end: 8 },
      { process: "P2", start: 8, end: 9 },
      { process: "P3", start: 9, end: 11 },
      { process: "P1", start: 11, end: 12 },
      { process: "P3", start: 12, end: 13 },
    ],
    videoId: "-jFGYDfWkXI",
    videoTitle: "Round Robin Scheduling",
    audioScript: "Round Robin is one of the most popular CPU scheduling algorithms, especially for time-sharing systems. Each process is assigned a fixed time slice called a quantum - typically between 10 to 100 milliseconds. Processes are arranged in a circular queue and each gets to execute for exactly one quantum. If a process completes within its quantum, great - it's removed from the queue. If not, it's preempted and moved to the back of the queue. The beauty of Round Robin is its fairness - every process gets equal CPU time, and no process starves. The main challenge is choosing the right quantum size. Too small causes excessive context switching overhead. Too large makes it behave like FCFS. Round Robin is used in virtually all modern operating systems for interactive user processes.",
    flowSteps: [
      { label: "Start", description: "Process arrives", type: "start" },
      { label: "Add to Queue", description: "Place at end of circular queue", type: "process" },
      { label: "Execute", description: "Run for one time quantum", type: "process" },
      { label: "Done?", description: "Process completed?", type: "decision" },
      { label: "Move to End", description: "Place at back of queue", type: "process" },
      { label: "Complete", description: "Process terminates", type: "end" }
    ]
  },
  {
    id: "priority-np",
    name: "Priority Non-Preemptive",
    fullName: "Priority Scheduling (Non-Preemptive)",
    icon: BarChart3,
    color: "bg-rose-500",
    definition: "Each process is assigned a priority. The CPU is allocated to the process with the highest priority. In non-preemptive mode, once a process starts, it runs to completion.",
    steps: [
      "Assign priority to each process (lower number = higher priority)",
      "When CPU is free, select process with highest priority",
      "Execute selected process to completion",
      "If priorities are equal, use FCFS",
      "Repeat until all processes complete"
    ],
    advantages: [
      "Important processes get CPU first",
      "Good for systems with varying process importance",
      "Flexible priority assignment",
      "Suitable for real-time systems"
    ],
    disadvantages: [
      "Low priority processes may starve",
      "Priority inversion problem",
      "Requires priority assignment mechanism",
      "Not fair for all processes"
    ],
    realWorld: "Used in operating systems for system processes, real-time systems, and network traffic management (QoS). Aging techniques prevent starvation.",
    processes: [
      { id: "P1", arrival: 0, burst: 5, priority: 2 },
      { id: "P2", arrival: 1, burst: 3, priority: 1 },
      { id: "P3", arrival: 2, burst: 5, priority: 3 },
    ],
    ganttExample: [
      { process: "P1", start: 0, end: 5 },
      { process: "P2", start: 5, end: 8 },
      { process: "P3", start: 8, end: 13 },
    ],
    videoId: "5xYvFN9OrZs",
    videoTitle: "Priority Non-Preemptive Scheduling",
    audioScript: "Priority Scheduling assigns a priority value to each process, and the CPU is allocated to the process with the highest priority. In the non-preemptive version, once a process starts executing, it runs to completion regardless of any higher priority processes that arrive. Priority can be determined by various factors - memory requirements, time limits, system versus user processes, or external factors like payment tiers. The main advantage is that important processes get served first, making it ideal for systems with varying process importance. However, the major drawback is starvation - low priority processes might wait indefinitely. To solve this, operating systems use a technique called aging, where a process's priority gradually increases the longer it waits. This ensures every process eventually gets CPU time.",
    flowSteps: [
      { label: "Start", description: "Process arrives", type: "start" },
      { label: "Assign Priority", description: "Set process priority", type: "process" },
      { label: "CPU Free?", description: "Check if CPU is available", type: "decision" },
      { label: "Select Highest", description: "Pick highest priority process", type: "process" },
      { label: "Execute", description: "Run to completion", type: "process" },
      { label: "Complete", description: "Process terminates", type: "end" }
    ]
  },
  {
    id: "priority-p",
    name: "Priority Preemptive",
    fullName: "Priority Scheduling (Preemptive)",
    icon: BarChart3,
    color: "bg-pink-500",
    definition: "Preemptive priority scheduling allows a higher priority process to preempt a running lower priority process. The CPU immediately switches to the higher priority process.",
    steps: [
      "When a new process arrives, compare its priority with current process",
      "If new process has higher priority, preempt current process",
      "Add preempted process back to ready queue",
      "Always run the highest priority process",
      "Continue until all processes complete"
    ],
    advantages: [
      "Critical processes get immediate attention",
      "Better response time for high priority tasks",
      "Flexible and dynamic scheduling",
      "Good for real-time systems"
    ],
    disadvantages: [
      "Higher context switching overhead",
      "Severe starvation for low priority processes",
      "Priority inversion can occur",
      "Complex implementation"
    ],
    realWorld: "Used in real-time operating systems (RTOS), interrupt handling in OS kernels, and multimedia systems where audio/video need priority.",
    processes: [
      { id: "P1", arrival: 0, burst: 5, priority: 2 },
      { id: "P2", arrival: 1, burst: 3, priority: 1 },
      { id: "P3", arrival: 2, burst: 5, priority: 3 },
    ],
    ganttExample: [
      { process: "P1", start: 0, end: 1 },
      { process: "P2", start: 1, end: 4 },
      { process: "P1", start: 4, end: 8 },
      { process: "P3", start: 8, end: 13 },
    ],
    videoId: "23h3lkHNL_s",
    videoTitle: "Priority Preemptive Scheduling",
    audioScript: "Preemptive Priority Scheduling is an extension of priority scheduling that allows immediate response to high-priority events. When a new process arrives with a higher priority than the currently running process, the scheduler immediately preempts the current process and switches to the new one. The preempted process returns to the ready queue with its remaining burst time intact. This is crucial in real-time systems where urgent tasks must be handled immediately - think of interrupt handlers in an operating system kernel. The downside is increased context switching overhead and potentially severe starvation for low-priority processes. Priority inversion is another concern, where a low-priority process holds a resource needed by a high-priority process. Solutions include priority inheritance and priority ceiling protocols.",
    flowSteps: [
      { label: "Start", description: "Process arrives", type: "start" },
      { label: "Compare Priority", description: "Compare with running process", type: "decision" },
      { label: "Higher?", description: "New priority > current?", type: "decision" },
      { label: "Preempt", description: "Switch to higher priority", type: "process" },
      { label: "Execute", description: "Run highest priority", type: "process" },
      { label: "Complete", description: "Process terminates", type: "end" }
    ]
  },
]

const processColors: Record<string, string> = {
  P1: "bg-blue-500",
  P2: "bg-emerald-500",
  P3: "bg-amber-500",
  P4: "bg-rose-500",
  P5: "bg-violet-500",
}

function AudioPlayer({ script, algoName }: { script: string; algoName: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const handlePlay = () => {
    if ('speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.resume()
        setIsPlaying(true)
        setIsPaused(false)
        return
      }
      
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(script)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
      setIsPaused(false)
    }
  }

  const handlePause = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
      setIsPaused(true)
    }
  }

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant={isPlaying ? "secondary" : "default"}
          size="sm"
          onClick={isPlaying ? handlePause : handlePlay}
          className="gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? "Pause" : isPaused ? "Resume" : "Play Audio"}
        </Button>
        {(isPlaying || isPaused) && (
          <Button variant="outline" size="sm" onClick={handleStop}>
            Stop
          </Button>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2 className="w-4 h-4" />
          <span>Using browser text-to-speech</span>
        </div>
      </div>
      <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {`"${script}"`}
        </p>
      </div>
    </div>
  )
}

// Process State Diagram Component
function ProcessStateDiagram() {
  const states = [
    { id: "new", label: "New", x: 50, y: 140, color: "bg-slate-500" },
    { id: "ready", label: "Ready", x: 200, y: 140, color: "bg-amber-500" },
    { id: "running", label: "Running", x: 350, y: 140, color: "bg-emerald-500" },
    { id: "waiting", label: "Waiting", x: 380, y: 220, color: "bg-blue-500" },
    { id: "terminated", label: "Terminated", x: 500, y: 140, color: "bg-rose-500" },
  ]

  return (
    <div className="w-full overflow-x-auto bg-muted/30 rounded-xl border border-border">
      <div className="min-w-[500px] h-[250px] relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 550 260" preserveAspectRatio="xMidYMid meet">
          {/* Arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
            </marker>
          </defs>
          
          {/* New -> Ready */}
          <line x1="100" y1="140" x2="170" y2="140" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
          <text x="135" y="130" className="fill-muted-foreground text-[11px] font-medium" textAnchor="middle">Admitted</text>
          
          {/* Ready -> Running */}
          <line x1="250" y1="140" x2="320" y2="140" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
          <text x="285" y="130" className="fill-muted-foreground text-[11px] font-medium" textAnchor="middle">Dispatch</text>
          
          {/* Running -> Terminated */}
          <line x1="400" y1="140" x2="470" y2="140" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
          <text x="435" y="130" className="fill-muted-foreground text-[11px] font-medium" textAnchor="middle">Exit</text>
          
          {/* Running -> Ready (preemption) */}
          <path d="M 350 115 Q 275 60 200 115" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
          <text x="275" y="75" className="fill-muted-foreground text-[11px] font-medium" textAnchor="middle">Preempt</text>
          
          {/* Running -> Waiting */}
          <line x1="370" y1="155" x2="370" y2="200" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
          <text x="385" y="180" className="fill-muted-foreground text-[11px]">I/O Wait</text>
          
          {/* Waiting -> Ready */}
          <path d="M 340 220 Q 270 220 240 155" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
          <text x="270" y="210" className="fill-muted-foreground text-[11px]">I/O Done</text>
        </svg>
        
        {/* State boxes */}
        {states.map((state) => (
          <div
            key={state.id}
            className={`absolute ${state.color} text-white px-3 py-1.5 rounded-lg font-medium text-xs shadow-lg transform -translate-x-1/2 -translate-y-1/2 min-w-[60px] text-center`}
            style={{ left: `${state.x}px`, top: `${state.y}px` }}
          >
            {state.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// Algorithm Flow Chart Component
function AlgorithmFlowChart({ steps, algoName }: { steps: { label: string; description: string; type: string }[]; algoName: string }) {
  const getShapeClasses = (type: string) => {
    switch (type) {
      case "start":
        return "rounded-full bg-emerald-500 text-white"
      case "end":
        return "rounded-full bg-rose-500 text-white"
      case "decision":
        return "rotate-45 bg-amber-500 text-white"
      case "process":
      default:
        return "rounded-lg bg-primary text-primary-foreground"
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <div
              className={`${getShapeClasses(step.type)} ${
                step.type === "decision" ? "w-16 h-16" : "px-6 py-3"
              } flex items-center justify-center font-medium text-sm shadow-md`}
            >
              <span className={step.type === "decision" ? "-rotate-45 text-center text-xs" : ""}>
                {step.label}
              </span>
            </div>
            <div className="text-sm text-muted-foreground max-w-[200px]">
              {step.description}
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex flex-col items-center py-1">
              <div className="w-0.5 h-4 bg-muted-foreground/50" />
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Helper to get process color safely
function getProcessColor(pid: string): string {
  const colors: Record<string, string> = {
    P1: "bg-blue-500",
    P2: "bg-emerald-500",
    P3: "bg-amber-500",
    P4: "bg-rose-500",
    P5: "bg-violet-500",
  }
  return colors[pid] || "bg-slate-500"
}

// Animated Ready Queue Visualization
function ReadyQueueDiagram({ algo, processes }: { algo: Algorithm; processes: { id: string; arrival: number; burst: number; priority?: number }[] }) {
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Build animation steps from Gantt chart
  const ganttSteps = algo.ganttExample.map((block, idx) => {
    // Find which processes have fully completed before this block starts
    const completedProcesses: string[] = []
    processes.forEach(p => {
      const processBlocks = algo.ganttExample.filter(g => g.process === p.id)
      const lastBlock = processBlocks[processBlocks.length - 1]
      if (lastBlock && lastBlock.end <= block.start) {
        completedProcesses.push(p.id)
      }
    })

    // Find processes waiting in ready queue (arrived but not running and not completed)
    const queueProcesses = processes
      .filter(p => p.id !== block.process)
      .filter(p => !completedProcesses.includes(p.id))
      .filter(p => p.arrival <= block.start)
      .map(p => p.id)

    return {
      running: block.process,
      queue: queueProcesses,
      time: block.start,
      completed: completedProcesses
    }
  })

  // Add final step showing all processes completed
  const lastBlock = algo.ganttExample[algo.ganttExample.length - 1]
  const finalStep = {
    running: "",
    queue: [] as string[],
    time: lastBlock ? lastBlock.end : 0,
    completed: processes.map(p => p.id)
  }

  const animationSteps = [...ganttSteps, finalStep]

  const startAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsAnimating(true)
    setAnimationStep(0)
    let step = 0
    intervalRef.current = setInterval(() => {
      step++
      if (step >= animationSteps.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsAnimating(false)
      } else {
        setAnimationStep(step)
      }
    }, 1500)
  }

  const current = animationSteps[animationStep] || animationSteps[0] || { running: "", queue: [], time: 0, completed: [] }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Time: <span className="font-mono font-bold text-foreground">{current?.time || 0}</span>
        </div>
        <Button size="sm" onClick={startAnimation} disabled={isAnimating} className="gap-2">
          {isAnimating ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isAnimating ? "Animating..." : "Play Animation"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Ready Queue */}
        <div className="col-span-1 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="w-4 h-4" />
            Ready Queue
          </div>
          <div className="bg-muted/50 rounded-lg p-3 min-h-[100px] border border-border/50">
            <div className="flex flex-col gap-2">
              {(current?.queue || []).map((pid, idx) => (
                <div
                  key={pid}
                  className={`${getProcessColor(pid)} text-white px-3 py-2 rounded-md text-sm font-medium text-center transition-all duration-500`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {pid}
                </div>
              ))}
              {(current?.queue || []).length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">Empty</div>
              )}
            </div>
          </div>
        </div>

        {/* CPU */}
        <div className="col-span-1 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Cpu className="w-4 h-4" />
            CPU (Running)
          </div>
          <div className="bg-muted/50 rounded-lg p-3 min-h-[100px] border-2 border-primary/50 flex items-center justify-center">
            {current?.running ? (
              <div className={`${getProcessColor(current.running)} text-white px-6 py-4 rounded-lg text-lg font-bold animate-pulse shadow-lg`}>
                {current.running}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Idle</div>
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="col-span-1 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle className="w-4 h-4" />
            Completed
          </div>
          <div className="bg-muted/50 rounded-lg p-3 min-h-[100px] border border-border/50">
            <div className="flex flex-wrap gap-2">
              {(current?.completed || []).map((pid) => (
                <div
                  key={pid}
                  className={`${getProcessColor(pid)} opacity-60 text-white px-3 py-2 rounded-md text-sm font-medium`}
                >
                  {pid}
                </div>
              ))}
              {(current?.completed || []).length === 0 && (
                <div className="text-xs text-muted-foreground text-center w-full py-4">None yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LearnPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("fcfs")
  const currentAlgo = algorithms.find(a => a.id === selectedAlgo) || algorithms[0]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/learn-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Learn Scheduling Algorithms</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deep dive into each CPU scheduling algorithm with definitions, examples, video tutorials, and visual demonstrations.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        <Tabs value={selectedAlgo} onValueChange={setSelectedAlgo} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-8">
            {algorithms.map((algo) => (
              <TabsTrigger
                key={algo.id}
                value={algo.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
              >
                <algo.icon className="w-4 h-4 mr-2" />
                {algo.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {algorithms.map((algo) => (
            <TabsContent key={algo.id} value={algo.id} className="mt-0">
              <div className="space-y-8">
                {/* Header */}
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl ${algo.color} flex items-center justify-center`}>
                        <algo.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{algo.fullName}</CardTitle>
                        <CardDescription>{algo.id.includes("p") && !algo.id.includes("np") ? "Preemptive" : "Non-Preemptive"} Algorithm</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{algo.definition}</p>
                  </CardContent>
                </Card>

                {/* Steps */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Step-by-Step Explanation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {algo.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </span>
                          <span className="text-muted-foreground pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Visual Diagrams Section */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-primary" />
                      Visual Diagrams
                    </CardTitle>
                    <CardDescription>
                      Interactive visualizations to understand the algorithm flow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="state" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="state">Process States</TabsTrigger>
                        <TabsTrigger value="flow">Algorithm Flow</TabsTrigger>
                        <TabsTrigger value="queue">Queue Animation</TabsTrigger>
                      </TabsList>

                      <TabsContent value="state" className="mt-0">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            This diagram shows the five states a process can be in and the transitions between them.
                            Understanding these states is fundamental to all scheduling algorithms.
                          </p>
                          <ProcessStateDiagram />
                          <div className="grid grid-cols-5 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded bg-slate-500" />
                              <span>New</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded bg-amber-500" />
                              <span>Ready</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded bg-emerald-500" />
                              <span>Running</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded bg-blue-500" />
                              <span>Waiting</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded bg-rose-500" />
                              <span>Terminated</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="flow" className="mt-0">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Flowchart showing how {algo.name} makes scheduling decisions step by step.
                          </p>
                          <div className="bg-muted/30 rounded-xl border border-border p-6 overflow-x-auto">
                            <AlgorithmFlowChart steps={algo.flowSteps} algoName={algo.name} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-emerald-500" />
                              <span>Start/End</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded bg-primary" />
                              <span>Process</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rotate-45 bg-amber-500" />
                              <span>Decision</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="queue" className="mt-0">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Watch how processes move through the ready queue, CPU, and completion using {algo.name}.
                          </p>
                          <div className="bg-muted/30 rounded-xl border border-border p-6">
                            <ReadyQueueDiagram algo={algo} processes={algo.processes} />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Example */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Example Process Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 font-medium text-foreground">Process</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Arrival</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Burst</th>
                              {algo.processes[0].priority !== undefined && (
                                <th className="text-left py-3 px-4 font-medium text-foreground">Priority</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {algo.processes.map((p) => (
                              <tr key={p.id} className="border-b border-border/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getProcessColor(p.id)}`} />
                                    <span className="font-medium">{p.id}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{p.arrival}</td>
                                <td className="py-3 px-4 text-muted-foreground">{p.burst}</td>
                                {p.priority !== undefined && (
                                  <td className="py-3 px-4 text-muted-foreground">{p.priority}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Gantt Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex h-12 rounded-lg overflow-hidden border border-border">
                          {(() => {
                            const maxTime = Math.max(...algo.ganttExample.map(g => g.end));
                            return algo.ganttExample.map((block, idx) => {
                              const width = ((block.end - block.start) / maxTime) * 100;
                              return (
                                <div
                                  key={idx}
                                  className={`${getProcessColor(block.process)} flex items-center justify-center text-white text-xs font-medium min-w-[20px]`}
                                  style={{ width: `${width}%` }}
                                >
                                  {width > 8 ? block.process : ''}
                                </div>
                              );
                            });
                          })()}
                        </div>
                        <div className="flex text-xs text-muted-foreground">
                          {algo.ganttExample.map((block, idx) => (
                            <div
                              key={idx}
                              style={{ width: `${((block.end - block.start) / 16) * 100}%` }}
                              className="flex justify-between"
                            >
                              <span>{block.start}</span>
                              {idx === algo.ganttExample.length - 1 && <span>{block.end}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {algo.advantages.map((adv, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {algo.disadvantages.map((dis, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Real World */}
                <Card className="border-border/50 bg-muted/30">
                  <CardHeader>
                    <CardTitle>Real-World Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{algo.realWorld}</p>
                  </CardContent>
                </Card>

                {/* Video and Audio Learning */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Video Tutorial */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Video Tutorial
                      </CardTitle>
                      <CardDescription>{algo.videoTitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${algo.videoId}`}
                          title={algo.videoTitle}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audio Explanation */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="w-5 h-5 text-primary" />
                        Audio Explanation
                      </CardTitle>
                      <CardDescription>Listen to a summary of {algo.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AudioPlayer script={algo.audioScript} algoName={algo.name} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
