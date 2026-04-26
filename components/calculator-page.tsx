"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, RotateCcw, Play, ChevronRight, Pause } from "lucide-react"

interface Process {
  id: string
  arrival: number
  burst: number
  priority: number
}

interface ScheduleResult {
  process: string
  start: number
  end: number
}

interface ProcessResult {
  id: string
  arrival: number
  burst: number
  priority: number
  completion: number
  turnaround: number
  waiting: number
}

type AlgorithmType = "fcfs" | "sjf-np" | "sjf-p" | "rr" | "priority-np" | "priority-p"

const processColors: Record<string, string> = {
  P1: "bg-blue-500",
  P2: "bg-emerald-500",
  P3: "bg-amber-500",
  P4: "bg-rose-500",
  P5: "bg-violet-500",
  P6: "bg-cyan-500",
  P7: "bg-orange-500",
  P8: "bg-pink-500",
}

export function CalculatorPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", arrival: 0, burst: 5, priority: 2 },
    { id: "P2", arrival: 1, burst: 3, priority: 1 },
    { id: "P3", arrival: 2, burst: 8, priority: 3 },
  ])
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("fcfs")
  const [timeQuantum, setTimeQuantum] = useState(2)
  const [results, setResults] = useState<ProcessResult[]>([])
  const [ganttChart, setGanttChart] = useState<ScheduleResult[]>([])
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const [isStepMode, setIsStepMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepLog, setStepLog] = useState<string[]>([])

  const addProcess = () => {
    const newId = `P${processes.length + 1}`
    setProcesses([...processes, { id: newId, arrival: 0, burst: 1, priority: 1 }])
  }

  const removeProcess = (index: number) => {
    if (processes.length > 1) {
      const newProcesses = processes.filter((_, i) => i !== index)
      // Renumber processes
      const renumbered = newProcesses.map((p, i) => ({ ...p, id: `P${i + 1}` }))
      setProcesses(renumbered)
    }
  }

  const updateProcess = (index: number, field: keyof Process, value: number) => {
    const newProcesses = [...processes]
    newProcesses[index] = { ...newProcesses[index], [field]: value }
    setProcesses(newProcesses)
  }

  const clearAll = () => {
    setProcesses([{ id: "P1", arrival: 0, burst: 1, priority: 1 }])
    setResults([])
    setGanttChart([])
    setExecutionLog([])
    setStepLog([])
    setCurrentStep(0)
    setIsStepMode(false)
  }

  const calculateSchedule = useCallback(() => {
    const procs = processes.map(p => ({ ...p }))
    let schedule: ScheduleResult[] = []
    let log: string[] = []
    
    switch (algorithm) {
      case "fcfs":
        ({ schedule, log } = runFCFS(procs))
        break
      case "sjf-np":
        ({ schedule, log } = runSJFNonPreemptive(procs))
        break
      case "sjf-p":
        ({ schedule, log } = runSJFPreemptive(procs))
        break
      case "rr":
        ({ schedule, log } = runRoundRobin(procs, timeQuantum))
        break
      case "priority-np":
        ({ schedule, log } = runPriorityNonPreemptive(procs))
        break
      case "priority-p":
        ({ schedule, log } = runPriorityPreemptive(procs))
        break
    }

    setGanttChart(schedule)
    setExecutionLog(log)
    
    // Calculate metrics
    const processResults = calculateMetrics(procs, schedule)
    setResults(processResults)
  }, [processes, algorithm, timeQuantum])

  const runFCFS = (procs: Process[]): { schedule: ScheduleResult[], log: string[] } => {
    const sorted = [...procs].sort((a, b) => a.arrival - b.arrival)
    const schedule: ScheduleResult[] = []
    const log: string[] = []
    let currentTime = 0

    for (const p of sorted) {
      if (currentTime < p.arrival) {
        log.push(`Time ${currentTime}: CPU idle, waiting for ${p.id}`)
        currentTime = p.arrival
      }
      log.push(`Time ${currentTime}: ${p.id} starts execution`)
      schedule.push({ process: p.id, start: currentTime, end: currentTime + p.burst })
      currentTime += p.burst
      log.push(`Time ${currentTime}: ${p.id} completes`)
    }

    return { schedule, log }
  }

  const runSJFNonPreemptive = (procs: Process[]): { schedule: ScheduleResult[], log: string[] } => {
    const schedule: ScheduleResult[] = []
    const log: string[] = []
    const remaining = [...procs]
    let currentTime = 0

    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrival <= currentTime)
      
      if (available.length === 0) {
        const nextArrival = Math.min(...remaining.map(p => p.arrival))
        log.push(`Time ${currentTime}: CPU idle`)
        currentTime = nextArrival
        continue
      }

      available.sort((a, b) => a.burst - b.burst)
      const selected = available[0]
      const idx = remaining.findIndex(p => p.id === selected.id)
      remaining.splice(idx, 1)

      log.push(`Time ${currentTime}: ${selected.id} selected (burst: ${selected.burst})`)
      schedule.push({ process: selected.id, start: currentTime, end: currentTime + selected.burst })
      currentTime += selected.burst
      log.push(`Time ${currentTime}: ${selected.id} completes`)
    }

    return { schedule, log }
  }

  const runSJFPreemptive = (procs: Process[]): { schedule: ScheduleResult[], log: string[] } => {
    const schedule: ScheduleResult[] = []
    const log: string[] = []
    const remaining = procs.map(p => ({ ...p, remainingBurst: p.burst }))
    let currentTime = 0
    let lastProcess = ""
    let blockStart = 0

    const maxTime = Math.max(...procs.map(p => p.arrival)) + procs.reduce((sum, p) => sum + p.burst, 0)

    while (remaining.some(p => p.remainingBurst > 0) && currentTime <= maxTime) {
      const available = remaining.filter(p => p.arrival <= currentTime && p.remainingBurst > 0)
      
      if (available.length === 0) {
        currentTime++
        continue
      }

      available.sort((a, b) => a.remainingBurst - b.remainingBurst)
      const selected = available[0]

      if (lastProcess !== selected.id) {
        if (lastProcess !== "" && blockStart < currentTime) {
          schedule.push({ process: lastProcess, start: blockStart, end: currentTime })
        }
        if (lastProcess !== "" && lastProcess !== selected.id) {
          log.push(`Time ${currentTime}: Preempting ${lastProcess}, switching to ${selected.id}`)
        } else if (lastProcess === "") {
          log.push(`Time ${currentTime}: ${selected.id} starts execution`)
        }
        lastProcess = selected.id
        blockStart = currentTime
      }

      selected.remainingBurst--
      currentTime++

      if (selected.remainingBurst === 0) {
        schedule.push({ process: selected.id, start: blockStart, end: currentTime })
        log.push(`Time ${currentTime}: ${selected.id} completes`)
        lastProcess = ""
      }
    }

    return { schedule, log }
  }

  const runRoundRobin = (procs: Process[], quantum: number): { schedule: ScheduleResult[], log: string[] } => {
    const schedule: ScheduleResult[] = []
    const log: string[] = []
    const queue: { id: string, remaining: number, arrival: number }[] = []
    const processMap = new Map(procs.map(p => [p.id, { ...p, remaining: p.burst }]))
    const sorted = [...procs].sort((a, b) => a.arrival - b.arrival)
    let currentTime = 0
    let nextArrivalIdx = 0

    // Add first arriving processes
    while (nextArrivalIdx < sorted.length && sorted[nextArrivalIdx].arrival <= currentTime) {
      queue.push({ id: sorted[nextArrivalIdx].id, remaining: sorted[nextArrivalIdx].burst, arrival: sorted[nextArrivalIdx].arrival })
      log.push(`Time ${currentTime}: ${sorted[nextArrivalIdx].id} arrives`)
      nextArrivalIdx++
    }

    while (queue.length > 0 || nextArrivalIdx < sorted.length) {
      if (queue.length === 0) {
        currentTime = sorted[nextArrivalIdx].arrival
        while (nextArrivalIdx < sorted.length && sorted[nextArrivalIdx].arrival <= currentTime) {
          queue.push({ id: sorted[nextArrivalIdx].id, remaining: sorted[nextArrivalIdx].burst, arrival: sorted[nextArrivalIdx].arrival })
          log.push(`Time ${currentTime}: ${sorted[nextArrivalIdx].id} arrives`)
          nextArrivalIdx++
        }
        continue
      }

      const current = queue.shift()!
      const executeTime = Math.min(quantum, current.remaining)
      log.push(`Time ${currentTime}: ${current.id} executes for ${executeTime} unit(s)`)
      schedule.push({ process: current.id, start: currentTime, end: currentTime + executeTime })
      currentTime += executeTime
      current.remaining -= executeTime

      // Add newly arrived processes
      while (nextArrivalIdx < sorted.length && sorted[nextArrivalIdx].arrival <= currentTime) {
        queue.push({ id: sorted[nextArrivalIdx].id, remaining: sorted[nextArrivalIdx].burst, arrival: sorted[nextArrivalIdx].arrival })
        log.push(`Time ${currentTime}: ${sorted[nextArrivalIdx].id} arrives`)
        nextArrivalIdx++
      }

      if (current.remaining > 0) {
        queue.push(current)
        log.push(`Time ${currentTime}: ${current.id} moved to back of queue (remaining: ${current.remaining})`)
      } else {
        log.push(`Time ${currentTime}: ${current.id} completes`)
      }
    }

    return { schedule, log }
  }

  const runPriorityNonPreemptive = (procs: Process[]): { schedule: ScheduleResult[], log: string[] } => {
    const schedule: ScheduleResult[] = []
    const log: string[] = []
    const remaining = [...procs]
    let currentTime = 0

    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrival <= currentTime)
      
      if (available.length === 0) {
        const nextArrival = Math.min(...remaining.map(p => p.arrival))
        log.push(`Time ${currentTime}: CPU idle`)
        currentTime = nextArrival
        continue
      }

      available.sort((a, b) => a.priority - b.priority)
      const selected = available[0]
      const idx = remaining.findIndex(p => p.id === selected.id)
      remaining.splice(idx, 1)

      log.push(`Time ${currentTime}: ${selected.id} selected (priority: ${selected.priority})`)
      schedule.push({ process: selected.id, start: currentTime, end: currentTime + selected.burst })
      currentTime += selected.burst
      log.push(`Time ${currentTime}: ${selected.id} completes`)
    }

    return { schedule, log }
  }

  const runPriorityPreemptive = (procs: Process[]): { schedule: ScheduleResult[], log: string[] } => {
    const schedule: ScheduleResult[] = []
    const log: string[] = []
    const remaining = procs.map(p => ({ ...p, remainingBurst: p.burst }))
    let currentTime = 0
    let lastProcess = ""
    let blockStart = 0

    const maxTime = Math.max(...procs.map(p => p.arrival)) + procs.reduce((sum, p) => sum + p.burst, 0)

    while (remaining.some(p => p.remainingBurst > 0) && currentTime <= maxTime) {
      const available = remaining.filter(p => p.arrival <= currentTime && p.remainingBurst > 0)
      
      if (available.length === 0) {
        currentTime++
        continue
      }

      available.sort((a, b) => a.priority - b.priority)
      const selected = available[0]

      if (lastProcess !== selected.id) {
        if (lastProcess !== "" && blockStart < currentTime) {
          schedule.push({ process: lastProcess, start: blockStart, end: currentTime })
        }
        if (lastProcess !== "" && lastProcess !== selected.id) {
          log.push(`Time ${currentTime}: Preempting ${lastProcess}, switching to ${selected.id} (higher priority)`)
        } else if (lastProcess === "") {
          log.push(`Time ${currentTime}: ${selected.id} starts execution`)
        }
        lastProcess = selected.id
        blockStart = currentTime
      }

      selected.remainingBurst--
      currentTime++

      if (selected.remainingBurst === 0) {
        schedule.push({ process: selected.id, start: blockStart, end: currentTime })
        log.push(`Time ${currentTime}: ${selected.id} completes`)
        lastProcess = ""
      }
    }

    return { schedule, log }
  }

  const calculateMetrics = (procs: Process[], schedule: ScheduleResult[]): ProcessResult[] => {
    const results: ProcessResult[] = []
    
    for (const p of procs) {
      const processBlocks = schedule.filter(s => s.process === p.id)
      if (processBlocks.length === 0) continue
      
      const completion = Math.max(...processBlocks.map(b => b.end))
      const turnaround = completion - p.arrival
      const waiting = turnaround - p.burst

      results.push({
        id: p.id,
        arrival: p.arrival,
        burst: p.burst,
        priority: p.priority,
        completion,
        turnaround,
        waiting,
      })
    }

    return results.sort((a, b) => parseInt(a.id.slice(1)) - parseInt(b.id.slice(1)))
  }

  const averageWaiting = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.waiting, 0) / results.length).toFixed(2) 
    : "0"
  const averageTurnaround = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.turnaround, 0) / results.length).toFixed(2) 
    : "0"

  const totalTime = ganttChart.length > 0 
    ? Math.max(...ganttChart.map(g => g.end)) 
    : 0

  // Step-by-step mode
  const startStepMode = () => {
    setIsStepMode(true)
    setCurrentStep(0)
    setStepLog([])
    calculateSchedule()
  }

  const nextStep = () => {
    if (currentStep < executionLog.length) {
      setStepLog([...stepLog, executionLog[currentStep]])
      setCurrentStep(currentStep + 1)
    }
  }

  const resetStepMode = () => {
    setIsStepMode(false)
    setCurrentStep(0)
    setStepLog([])
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/images/calculator-visual.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">CPU Scheduling Calculator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Input process data, select an algorithm, and visualize the scheduling results with Gantt charts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Process Input</CardTitle>
                <CardDescription>Add processes with their arrival time, burst time, and priority.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {processes.map((process, index) => (
                  <div key={process.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${processColors[process.id] || 'bg-gray-500'}`} />
                        <span className="font-medium">{process.id}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProcess(index)}
                        disabled={processes.length <= 1}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Arrival</Label>
                        <Input 
                              type="number" 
                              min="0" 
                              value={process.arrival} 
                              onChange={(e) => updateProcess(index, "arrival", parseInt(e.target.value) || 0)} 
                              className="h-9"
                              required 
                          />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Burst</Label>
                        <Input 
  type="number" 
  min="1" 
  value={process.burst} 
  onChange={(e) => updateProcess(index, "burst", parseInt(e.target.value) || 1)} 
  className="h-9"
  required 
/>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Priority</Label>
                        <Input 
  type="number" 
  min="1" 
  value={process.priority} 
  onChange={(e) => updateProcess(index, "priority", parseInt(e.target.value) || 1)} 
  className="h-9"
  required 
/>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button onClick={addProcess} variant="outline" className="flex-1 gap-2">
                    <Plus className="h-4 w-4" /> Add Process
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Algorithm Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fcfs">FCFS (First Come First Serve)</SelectItem>
                    <SelectItem value="sjf-np">SJF Non-Preemptive</SelectItem>
                    <SelectItem value="sjf-p">SJF Preemptive (SRTF)</SelectItem>
                    <SelectItem value="rr">Round Robin</SelectItem>
                    <SelectItem value="priority-np">Priority Non-Preemptive</SelectItem>
                    <SelectItem value="priority-p">Priority Preemptive</SelectItem>
                  </SelectContent>
                </Select>

                {algorithm === "rr" && (
                  <div>
                    <Label>Time Quantum</Label>
                    <Input
                      type="number"
                      min="1"
                      value={timeQuantum}
                      onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={calculateSchedule} className="flex-1 gap-2">
                    <Play className="h-4 w-4" /> Calculate
                  </Button>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm font-medium">Step-by-Step Mode</p>
                  <div className="flex gap-2">
                    {!isStepMode ? (
                      <Button onClick={startStepMode} variant="outline" className="flex-1 gap-2">
                        <Play className="h-4 w-4" /> Start
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={nextStep} 
                          variant="outline" 
                          className="flex-1 gap-2"
                          disabled={currentStep >= executionLog.length}
                        >
                          <ChevronRight className="h-4 w-4" /> Next
                        </Button>
                        <Button onClick={resetStepMode} variant="outline" className="gap-2">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gantt Chart */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Gantt Chart</CardTitle>
                <CardDescription>Visual timeline of process execution</CardDescription>
              </CardHeader>
              <CardContent>
                {ganttChart.length > 0 ? (
                  <div className="space-y-4">
                    <div 
  id="gantt-chart" 
  role="graphics-document" 
  aria-label="CPU Scheduling Timeline" 
  className="overflow-x-auto"
>
                      <div className="min-w-full">
                        <div className="flex h-14 rounded-lg overflow-hidden border border-border">
                          {ganttChart.map((block, idx) => {
                            const width = ((block.end - block.start) / totalTime) * 100
                            return (
                              <div
                                key={idx}
                                role="img"
                                aria-label={`Process ${block.process} from time ${block.start} to ${block.end}`}
                                className={`${processColors[block.process] || 'bg-gray-500'} flex items-center justify-center text-white text-sm font-medium relative group cursor-pointer transition-opacity hover:opacity-90`}
                                style={{ width: `${Math.max(width, 3)}%` }}
                              >
                                {width > 5 && block.process}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                  {block.process}: {block.start} - {block.end}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex mt-1 text-xs text-muted-foreground">
                          <span>0</span>
                          <span className="ml-auto">{totalTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4">
                      {processes.map(p => (
                        <div key={p.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-3 h-3 rounded ${processColors[p.id]}`} />
                          <span>{p.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    Click Calculate to generate the Gantt chart
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Completion, turnaround, and waiting times</CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Process</th>
                            <th className="text-left py-3 px-4 font-medium">Arrival</th>
                            <th className="text-left py-3 px-4 font-medium">Burst</th>
                            <th className="text-left py-3 px-4 font-medium">Completion</th>
                            <th className="text-left py-3 px-4 font-medium">Turnaround</th>
                            <th className="text-left py-3 px-4 font-medium">Waiting</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((r) => (
                            <tr key={r.id} className="border-b border-border/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${processColors[r.id]}`} />
                                  <span className="font-medium">{r.id}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">{r.arrival}</td>
                              <td className="py-3 px-4 text-muted-foreground">{r.burst}</td>
                              <td className="py-3 px-4 font-medium">{r.completion}</td>
                              <td className="py-3 px-4 font-medium">{r.turnaround}</td>
                              <td className="py-3 px-4 font-medium">{r.waiting}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Waiting Time</p>
                        <p className="text-2xl font-bold text-foreground">{averageWaiting}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Turnaround Time</p>
                        <p className="text-2xl font-bold text-foreground">{averageTurnaround}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    Results will appear here after calculation
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Execution Log */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Execution Log</CardTitle>
                <CardDescription>
                  {isStepMode 
                    ? `Step ${currentStep} of ${executionLog.length}` 
                    : "Step-by-step breakdown of the algorithm"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-1 font-mono text-sm">
                  {(isStepMode ? stepLog : executionLog).map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`py-1 px-2 rounded ${idx % 2 === 0 ? 'bg-muted/30' : ''}`}
                    >
                      {log}
                    </div>
                  ))}
                  {(isStepMode ? stepLog : executionLog).length === 0 && (
                    <div className="text-muted-foreground py-4 text-center">
                      {isStepMode ? "Click Next to see each step" : "Run the calculator to see the execution log"}
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
