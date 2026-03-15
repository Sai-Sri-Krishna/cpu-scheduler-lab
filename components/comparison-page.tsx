"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, BarChart3, Play } from "lucide-react"

interface Process {
  id: string
  arrival: number
  burst: number
  priority: number
}

interface AlgorithmResult {
  name: string
  avgWaiting: number
  avgTurnaround: number
  totalTime: number
  gantt: { process: string; start: number; end: number }[]
}

const processColors: Record<string, string> = {
  P1: "bg-blue-500",
  P2: "bg-emerald-500",
  P3: "bg-amber-500",
  P4: "bg-rose-500",
  P5: "bg-violet-500",
  P6: "bg-cyan-500",
}

export function ComparisonPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", arrival: 0, burst: 6, priority: 2 },
    { id: "P2", arrival: 1, burst: 4, priority: 1 },
    { id: "P3", arrival: 2, burst: 8, priority: 3 },
    { id: "P4", arrival: 3, burst: 2, priority: 2 },
  ])
  const [timeQuantum, setTimeQuantum] = useState(2)
  const [results, setResults] = useState<AlgorithmResult[]>([])

  const addProcess = () => {
    const newId = `P${processes.length + 1}`
    setProcesses([...processes, { id: newId, arrival: 0, burst: 1, priority: 1 }])
  }

  const removeProcess = (index: number) => {
    if (processes.length > 1) {
      const newProcesses = processes.filter((_, i) => i !== index)
      const renumbered = newProcesses.map((p, i) => ({ ...p, id: `P${i + 1}` }))
      setProcesses(renumbered)
    }
  }

  const updateProcess = (index: number, field: keyof Process, value: number) => {
    const newProcesses = [...processes]
    newProcesses[index] = { ...newProcesses[index], [field]: value }
    setProcesses(newProcesses)
  }

  const runAllAlgorithms = () => {
    const algorithms: AlgorithmResult[] = []

    // FCFS
    algorithms.push(runFCFS([...processes]))

    // SJF Non-Preemptive
    algorithms.push(runSJFNP([...processes]))

    // SJF Preemptive
    algorithms.push(runSJFP([...processes]))

    // Round Robin
    algorithms.push(runRR([...processes], timeQuantum))

    // Priority Non-Preemptive
    algorithms.push(runPriorityNP([...processes]))

    // Priority Preemptive
    algorithms.push(runPriorityP([...processes]))

    setResults(algorithms)
  }

  const runFCFS = (procs: Process[]): AlgorithmResult => {
    const sorted = [...procs].sort((a, b) => a.arrival - b.arrival)
    const gantt: { process: string; start: number; end: number }[] = []
    let currentTime = 0

    for (const p of sorted) {
      if (currentTime < p.arrival) currentTime = p.arrival
      gantt.push({ process: p.id, start: currentTime, end: currentTime + p.burst })
      currentTime += p.burst
    }

    const metrics = calculateMetrics(procs, gantt)
    return { name: "FCFS", ...metrics, gantt }
  }

  const runSJFNP = (procs: Process[]): AlgorithmResult => {
    const gantt: { process: string; start: number; end: number }[] = []
    const remaining = [...procs]
    let currentTime = 0

    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrival <= currentTime)
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrival))
        continue
      }
      available.sort((a, b) => a.burst - b.burst)
      const selected = available[0]
      remaining.splice(remaining.findIndex(p => p.id === selected.id), 1)
      gantt.push({ process: selected.id, start: currentTime, end: currentTime + selected.burst })
      currentTime += selected.burst
    }

    const metrics = calculateMetrics(procs, gantt)
    return { name: "SJF Non-Preemptive", ...metrics, gantt }
  }

  const runSJFP = (procs: Process[]): AlgorithmResult => {
    const gantt: { process: string; start: number; end: number }[] = []
    const remaining = procs.map(p => ({ ...p, rem: p.burst }))
    let currentTime = 0
    let lastProcess = ""
    let blockStart = 0
    const maxTime = Math.max(...procs.map(p => p.arrival)) + procs.reduce((sum, p) => sum + p.burst, 0)

    while (remaining.some(p => p.rem > 0) && currentTime <= maxTime) {
      const available = remaining.filter(p => p.arrival <= currentTime && p.rem > 0)
      if (available.length === 0) { currentTime++; continue }
      available.sort((a, b) => a.rem - b.rem)
      const selected = available[0]

      if (lastProcess !== selected.id) {
        if (lastProcess !== "" && blockStart < currentTime) {
          gantt.push({ process: lastProcess, start: blockStart, end: currentTime })
        }
        lastProcess = selected.id
        blockStart = currentTime
      }

      selected.rem--
      currentTime++

      if (selected.rem === 0) {
        gantt.push({ process: selected.id, start: blockStart, end: currentTime })
        lastProcess = ""
      }
    }

    const metrics = calculateMetrics(procs, gantt)
    return { name: "SJF Preemptive", ...metrics, gantt }
  }

  const runRR = (procs: Process[], quantum: number): AlgorithmResult => {
    const gantt: { process: string; start: number; end: number }[] = []
    const queue: { id: string; rem: number; arrival: number }[] = []
    const sorted = [...procs].sort((a, b) => a.arrival - b.arrival)
    let currentTime = 0
    let nextIdx = 0

    while (nextIdx < sorted.length && sorted[nextIdx].arrival <= currentTime) {
      queue.push({ id: sorted[nextIdx].id, rem: sorted[nextIdx].burst, arrival: sorted[nextIdx].arrival })
      nextIdx++
    }

    while (queue.length > 0 || nextIdx < sorted.length) {
      if (queue.length === 0) {
        currentTime = sorted[nextIdx].arrival
        while (nextIdx < sorted.length && sorted[nextIdx].arrival <= currentTime) {
          queue.push({ id: sorted[nextIdx].id, rem: sorted[nextIdx].burst, arrival: sorted[nextIdx].arrival })
          nextIdx++
        }
        continue
      }

      const current = queue.shift()!
      const execTime = Math.min(quantum, current.rem)
      gantt.push({ process: current.id, start: currentTime, end: currentTime + execTime })
      currentTime += execTime
      current.rem -= execTime

      while (nextIdx < sorted.length && sorted[nextIdx].arrival <= currentTime) {
        queue.push({ id: sorted[nextIdx].id, rem: sorted[nextIdx].burst, arrival: sorted[nextIdx].arrival })
        nextIdx++
      }

      if (current.rem > 0) queue.push(current)
    }

    const metrics = calculateMetrics(procs, gantt)
    return { name: `Round Robin (TQ=${quantum})`, ...metrics, gantt }
  }

  const runPriorityNP = (procs: Process[]): AlgorithmResult => {
    const gantt: { process: string; start: number; end: number }[] = []
    const remaining = [...procs]
    let currentTime = 0

    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrival <= currentTime)
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrival))
        continue
      }
      available.sort((a, b) => a.priority - b.priority)
      const selected = available[0]
      remaining.splice(remaining.findIndex(p => p.id === selected.id), 1)
      gantt.push({ process: selected.id, start: currentTime, end: currentTime + selected.burst })
      currentTime += selected.burst
    }

    const metrics = calculateMetrics(procs, gantt)
    return { name: "Priority Non-Preemptive", ...metrics, gantt }
  }

  const runPriorityP = (procs: Process[]): AlgorithmResult => {
    const gantt: { process: string; start: number; end: number }[] = []
    const remaining = procs.map(p => ({ ...p, rem: p.burst }))
    let currentTime = 0
    let lastProcess = ""
    let blockStart = 0
    const maxTime = Math.max(...procs.map(p => p.arrival)) + procs.reduce((sum, p) => sum + p.burst, 0)

    while (remaining.some(p => p.rem > 0) && currentTime <= maxTime) {
      const available = remaining.filter(p => p.arrival <= currentTime && p.rem > 0)
      if (available.length === 0) { currentTime++; continue }
      available.sort((a, b) => a.priority - b.priority)
      const selected = available[0]

      if (lastProcess !== selected.id) {
        if (lastProcess !== "" && blockStart < currentTime) {
          gantt.push({ process: lastProcess, start: blockStart, end: currentTime })
        }
        lastProcess = selected.id
        blockStart = currentTime
      }

      selected.rem--
      currentTime++

      if (selected.rem === 0) {
        gantt.push({ process: selected.id, start: blockStart, end: currentTime })
        lastProcess = ""
      }
    }

    const metrics = calculateMetrics(procs, gantt)
    return { name: "Priority Preemptive", ...metrics, gantt }
  }

  const calculateMetrics = (procs: Process[], gantt: { process: string; start: number; end: number }[]) => {
    let totalWaiting = 0
    let totalTurnaround = 0
    const totalTime = gantt.length > 0 ? Math.max(...gantt.map(g => g.end)) : 0

    for (const p of procs) {
      const blocks = gantt.filter(g => g.process === p.id)
      if (blocks.length === 0) continue
      const completion = Math.max(...blocks.map(b => b.end))
      const turnaround = completion - p.arrival
      const waiting = turnaround - p.burst
      totalWaiting += waiting
      totalTurnaround += turnaround
    }

    return {
      avgWaiting: procs.length > 0 ? totalWaiting / procs.length : 0,
      avgTurnaround: procs.length > 0 ? totalTurnaround / procs.length : 0,
      totalTime,
    }
  }

  const maxAvgWaiting = results.length > 0 ? Math.max(...results.map(r => r.avgWaiting)) : 1
  const maxAvgTurnaround = results.length > 0 ? Math.max(...results.map(r => r.avgTurnaround)) : 1

  const bestWaiting = results.length > 0 ? results.reduce((best, r) => r.avgWaiting < best.avgWaiting ? r : best) : null
  const bestTurnaround = results.length > 0 ? results.reduce((best, r) => r.avgTurnaround < best.avgTurnaround ? r : best) : null

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Algorithm Comparison</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare all scheduling algorithms side-by-side using the same process data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Process Input</CardTitle>
              <CardDescription>Define processes to compare algorithms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {processes.map((process, index) => (
                <div key={process.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${processColors[process.id] || 'bg-gray-500'}`} />
                      <span className="font-medium text-sm">{process.id}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProcess(index)}
                      disabled={processes.length <= 1}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Arr</Label>
                      <Input
                        type="number"
                        min="0"
                        value={process.arrival}
                        onChange={(e) => updateProcess(index, "arrival", parseInt(e.target.value) || 0)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Burst</Label>
                      <Input
                        type="number"
                        min="1"
                        value={process.burst}
                        onChange={(e) => updateProcess(index, "burst", parseInt(e.target.value) || 1)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Pri</Label>
                      <Input
                        type="number"
                        min="1"
                        value={process.priority}
                        onChange={(e) => updateProcess(index, "priority", parseInt(e.target.value) || 1)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={addProcess} variant="outline" size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" /> Add Process
              </Button>

              <div>
                <Label>Time Quantum (Round Robin)</Label>
                <Input
                  type="number"
                  min="1"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>

              <Button onClick={runAllAlgorithms} className="w-full gap-2">
                <Play className="h-4 w-4" /> Compare All
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Comparison Table */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Comparison Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">Algorithm</th>
                          <th className="text-left py-3 px-4 font-medium">Avg Waiting</th>
                          <th className="text-left py-3 px-4 font-medium">Avg Turnaround</th>
                          <th className="text-left py-3 px-4 font-medium">Total Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r) => (
                          <tr key={r.name} className="border-b border-border/50">
                            <td className="py-3 px-4">
                              <span className="font-medium">{r.name}</span>
                              {bestWaiting?.name === r.name && (
                                <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                                  Best WT
                                </span>
                              )}
                              {bestTurnaround?.name === r.name && bestTurnaround.name !== bestWaiting?.name && (
                                <span className="ml-2 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                                  Best TAT
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono">{r.avgWaiting.toFixed(2)}</td>
                            <td className="py-3 px-4 font-mono">{r.avgTurnaround.toFixed(2)}</td>
                            <td className="py-3 px-4 font-mono">{r.totalTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    Click Compare All to see results
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bar Charts */}
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Waiting Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.map((r) => (
                        <div key={r.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="truncate">{r.name}</span>
                            <span className="font-mono">{r.avgWaiting.toFixed(2)}</span>
                          </div>
                          <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                bestWaiting?.name === r.name ? 'bg-emerald-500' : 'bg-primary'
                              }`}
                              style={{ width: `${(r.avgWaiting / maxAvgWaiting) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Turnaround Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.map((r) => (
                        <div key={r.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="truncate">{r.name}</span>
                            <span className="font-mono">{r.avgTurnaround.toFixed(2)}</span>
                          </div>
                          <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                bestTurnaround?.name === r.name ? 'bg-emerald-500' : 'bg-primary'
                              }`}
                              style={{ width: `${(r.avgTurnaround / maxAvgTurnaround) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Gantt Charts */}
            {results.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Gantt Charts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {results.map((r) => (
                    <div key={r.name} className="space-y-2">
                      <p className="text-sm font-medium">{r.name}</p>
                      <div className="flex h-8 rounded-lg overflow-hidden border border-border">
                        {r.gantt.map((block, idx) => {
                          const width = ((block.end - block.start) / r.totalTime) * 100
                          return (
                            <div
                              key={idx}
                              className={`${processColors[block.process] || 'bg-gray-500'} flex items-center justify-center text-white text-xs font-medium`}
                              style={{ width: `${Math.max(width, 2)}%` }}
                              title={`${block.process}: ${block.start}-${block.end}`}
                            >
                              {width > 6 && block.process}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
