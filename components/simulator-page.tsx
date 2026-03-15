"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Cpu, Clock, CheckCircle } from "lucide-react"

interface Process {
  id: string
  arrival: number
  burst: number
  priority: number
  remaining: number
  color: string
}

interface SimulationState {
  time: number
  readyQueue: Process[]
  currentProcess: Process | null
  completedProcesses: Process[]
  ganttChart: { process: string; start: number; end: number }[]
  log: string[]
}

type AlgorithmType = "fcfs" | "sjf-np" | "sjf-p" | "rr" | "priority-np" | "priority-p"

const processColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
]

const defaultProcesses: Process[] = [
  { id: "P1", arrival: 0, burst: 4, priority: 2, remaining: 4, color: processColors[0] },
  { id: "P2", arrival: 1, burst: 3, priority: 1, remaining: 3, color: processColors[1] },
  { id: "P3", arrival: 2, burst: 5, priority: 3, remaining: 5, color: processColors[2] },
  { id: "P4", arrival: 3, burst: 2, priority: 2, remaining: 2, color: processColors[3] },
]

export function SimulatorPage() {
  const [processes, setProcesses] = useState<Process[]>(defaultProcesses.map(p => ({ ...p })))
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("fcfs")
  const [timeQuantum, setTimeQuantum] = useState(2)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [simulation, setSimulation] = useState<SimulationState>({
    time: 0,
    readyQueue: [],
    currentProcess: null,
    completedProcesses: [],
    ganttChart: [],
    log: [],
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const processesRef = useRef<Process[]>([])
  const simulationRef = useRef<SimulationState>(simulation)
  const quantumCounterRef = useRef(0)

  useEffect(() => {
    simulationRef.current = simulation
  }, [simulation])

  const resetSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    processesRef.current = processes.map(p => ({ ...p, remaining: p.burst }))
    quantumCounterRef.current = 0
    setSimulation({
      time: 0,
      readyQueue: [],
      currentProcess: null,
      completedProcesses: [],
      ganttChart: [],
      log: [],
    })
  }, [processes])

  const selectNextProcess = (state: SimulationState, algo: AlgorithmType): Process | null => {
    if (state.readyQueue.length === 0) return null

    const queue = [...state.readyQueue]

    switch (algo) {
      case "fcfs":
        return queue[0]
      case "sjf-np":
      case "sjf-p":
        queue.sort((a, b) => a.remaining - b.remaining)
        return queue[0]
      case "rr":
        return queue[0]
      case "priority-np":
      case "priority-p":
        queue.sort((a, b) => a.priority - b.priority)
        return queue[0]
      default:
        return queue[0]
    }
  }

  const simulateStep = useCallback(() => {
    setSimulation(prevState => {
      const state = { ...prevState }
      const time = state.time
      const processes = processesRef.current

      // Check for newly arriving processes
      const newArrivals = processes.filter(p => 
        p.arrival === time && 
        !state.readyQueue.find(q => q.id === p.id) && 
        !state.completedProcesses.find(c => c.id === p.id) &&
        p.id !== state.currentProcess?.id
      )

      if (newArrivals.length > 0) {
        state.readyQueue = [...state.readyQueue, ...newArrivals]
        newArrivals.forEach(p => {
          state.log = [...state.log, `Time ${time}: ${p.id} arrives`]
        })
      }

      // Check for preemption in preemptive algorithms
      if (state.currentProcess && (algorithm === "sjf-p" || algorithm === "priority-p")) {
        const allInQueue = [...state.readyQueue]
        if (allInQueue.length > 0) {
          let shouldPreempt = false
          let newProcess: Process | null = null

          if (algorithm === "sjf-p") {
            const shortest = allInQueue.reduce((min, p) => 
              p.remaining < min.remaining ? p : min
            )
            if (shortest.remaining < state.currentProcess.remaining) {
              shouldPreempt = true
              newProcess = shortest
            }
          } else if (algorithm === "priority-p") {
            const highest = allInQueue.reduce((best, p) => 
              p.priority < best.priority ? p : best
            )
            if (highest.priority < state.currentProcess.priority) {
              shouldPreempt = true
              newProcess = highest
            }
          }

          if (shouldPreempt && newProcess) {
            state.log = [...state.log, `Time ${time}: Preempting ${state.currentProcess.id} for ${newProcess.id}`]
            state.readyQueue = [...state.readyQueue, state.currentProcess]
            state.readyQueue = state.readyQueue.filter(p => p.id !== newProcess!.id)
            state.currentProcess = newProcess

            // Update Gantt chart
            const lastBlock = state.ganttChart[state.ganttChart.length - 1]
            if (lastBlock && lastBlock.process !== newProcess.id) {
              state.ganttChart = [...state.ganttChart, { process: newProcess.id, start: time, end: time }]
            }
          }
        }
      }

      // If no current process, select one
      if (!state.currentProcess && state.readyQueue.length > 0) {
        const nextProcess = selectNextProcess(state, algorithm)
        if (nextProcess) {
          state.currentProcess = nextProcess
          state.readyQueue = state.readyQueue.filter(p => p.id !== nextProcess.id)
          state.log = [...state.log, `Time ${time}: ${nextProcess.id} starts/resumes execution`]
          state.ganttChart = [...state.ganttChart, { process: nextProcess.id, start: time, end: time }]
          quantumCounterRef.current = 0
        }
      }

      // Execute current process
      if (state.currentProcess) {
        state.currentProcess = { ...state.currentProcess, remaining: state.currentProcess.remaining - 1 }
        quantumCounterRef.current++

        // Update Gantt chart end time
        const lastBlock = state.ganttChart[state.ganttChart.length - 1]
        if (lastBlock && lastBlock.process === state.currentProcess.id) {
          state.ganttChart = [
            ...state.ganttChart.slice(0, -1),
            { ...lastBlock, end: time + 1 }
          ]
        }

        // Check if process completed
        if (state.currentProcess.remaining === 0) {
          state.log = [...state.log, `Time ${time + 1}: ${state.currentProcess.id} completes`]
          state.completedProcesses = [...state.completedProcesses, state.currentProcess]
          state.currentProcess = null
          quantumCounterRef.current = 0
        }
        // Check for Round Robin time quantum expiry
        else if (algorithm === "rr" && quantumCounterRef.current >= timeQuantum) {
          state.log = [...state.log, `Time ${time + 1}: ${state.currentProcess.id} quantum expired, moved to queue`]
          state.readyQueue = [...state.readyQueue, state.currentProcess]
          state.currentProcess = null
          quantumCounterRef.current = 0
        }
      }

      // Check if simulation is complete
      const allProcesses = processesRef.current
      const totalBurst = allProcesses.reduce((sum, p) => sum + p.burst, 0)
      const maxTime = Math.max(...allProcesses.map(p => p.arrival)) + totalBurst

      if (state.completedProcesses.length === allProcesses.length || time > maxTime) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        setIsRunning(false)
        state.log = [...state.log, `Simulation complete!`]
      }

      return { ...state, time: time + 1 }
    })
  }, [algorithm, timeQuantum])

  const startSimulation = () => {
    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setIsRunning(false)
    } else {
      processesRef.current = processes.map(p => ({ ...p, remaining: p.burst }))
      setIsRunning(true)
      intervalRef.current = setInterval(simulateStep, speed)
    }
  }

  useEffect(() => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(simulateStep, speed)
    }
  }, [speed, isRunning, simulateStep])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const totalTime = Math.max(...processes.map(p => p.arrival + p.burst), ...simulation.ganttChart.map(g => g.end), 1)

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/images/simulator-visual.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Visual CPU Simulator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch CPU scheduling algorithms in action with animated process execution and real-time queue visualization.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Algorithm</Label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmType)} disabled={isRunning}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fcfs">FCFS</SelectItem>
                    <SelectItem value="sjf-np">SJF Non-Preemptive</SelectItem>
                    <SelectItem value="sjf-p">SJF Preemptive</SelectItem>
                    <SelectItem value="rr">Round Robin</SelectItem>
                    <SelectItem value="priority-np">Priority Non-Preemptive</SelectItem>
                    <SelectItem value="priority-p">Priority Preemptive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {algorithm === "rr" && (
                <div>
                  <Label>Time Quantum</Label>
                  <Input
                    type="number"
                    min="1"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                    className="mt-1"
                    disabled={isRunning}
                  />
                </div>
              )}

              <div>
                <Label>Speed (ms per tick)</Label>
                <Input
                  type="number"
                  min="100"
                  max="2000"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value) || 1000)}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={startSimulation} className="flex-1 gap-2">
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button onClick={resetSimulation} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Current Time</p>
                <div className="text-4xl font-bold text-primary">{simulation.time}</div>
              </div>
            </CardContent>
          </Card>

          {/* Main Visualization */}
          <div className="lg:col-span-3 space-y-6">
            {/* Process States */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ready Queue */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Ready Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[100px] space-y-2">
                    {simulation.readyQueue.length > 0 ? (
                      simulation.readyQueue.map((p, idx) => (
                        <div
                          key={`${p.id}-${idx}`}
                          className={`${p.color} text-white px-4 py-2 rounded-lg flex items-center justify-between animate-in slide-in-from-left duration-300`}
                        >
                          <span className="font-medium">{p.id}</span>
                          <span className="text-sm opacity-90">Remaining: {p.remaining}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-sm text-center py-8">
                        Queue is empty
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CPU */}
              <Card className="border-border/50 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cpu className="w-5 h-5 text-primary" />
                    CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[100px] flex items-center justify-center">
                    {simulation.currentProcess ? (
                      <div
                        className={`${simulation.currentProcess.color} text-white px-6 py-4 rounded-xl text-center w-full animate-pulse`}
                      >
                        <div className="text-2xl font-bold">{simulation.currentProcess.id}</div>
                        <div className="text-sm opacity-90">
                          Remaining: {simulation.currentProcess.remaining}
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm text-center">
                        CPU Idle
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Completed */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[100px] space-y-2">
                    {simulation.completedProcesses.length > 0 ? (
                      simulation.completedProcesses.map((p, idx) => (
                        <div
                          key={`${p.id}-${idx}`}
                          className={`${p.color} opacity-70 text-white px-4 py-2 rounded-lg flex items-center justify-between animate-in slide-in-from-right duration-300`}
                        >
                          <span className="font-medium">{p.id}</span>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-sm text-center py-8">
                        No completed processes
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gantt Chart */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Gantt Chart</CardTitle>
                <CardDescription>Real-time execution timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      <div className="flex h-12 rounded-lg overflow-hidden border border-border bg-muted/30">
                        {simulation.ganttChart.map((block, idx) => {
                          const process = processes.find(p => p.id === block.process) || 
                            simulation.completedProcesses.find(p => p.id === block.process)
                          const width = ((block.end - block.start) / Math.max(totalTime, simulation.time)) * 100
                          return (
                            <div
                              key={idx}
                              className={`${process?.color || 'bg-gray-500'} flex items-center justify-center text-white text-sm font-medium transition-all duration-300`}
                              style={{ width: `${Math.max(width, 2)}%` }}
                            >
                              {width > 5 && block.process}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>0</span>
                        <span>{simulation.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4">
                    {processes.map(p => (
                      <div key={p.id} className="flex items-center gap-2 text-sm">
                        <div className={`w-3 h-3 rounded ${p.color}`} />
                        <span>{p.id} (A:{p.arrival}, B:{p.burst})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Execution Log */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Execution Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-sm">
                  {simulation.log.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`py-1 px-2 rounded animate-in slide-in-from-bottom duration-200 ${
                        idx % 2 === 0 ? 'bg-muted/30' : ''
                      } ${entry.includes('completes') ? 'text-emerald-600 dark:text-emerald-400' : ''} ${
                        entry.includes('Preempting') ? 'text-amber-600 dark:text-amber-400' : ''
                      }`}
                    >
                      {entry}
                    </div>
                  ))}
                  {simulation.log.length === 0 && (
                    <div className="text-muted-foreground text-center py-4">
                      Start the simulation to see execution log
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
