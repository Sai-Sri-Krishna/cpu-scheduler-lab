"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, CheckCircle, BarChart3 } from "lucide-react"

interface Problem {
  id: number
  title: string
  algorithm: string
  difficulty: "Easy" | "Medium" | "Hard"
  processes: { id: string; arrival: number; burst: number; priority?: number }[]
  question: string
  solution: {
    gantt: { process: string; start: number; end: number }[]
    results: { id: string; completion: number; turnaround: number; waiting: number }[]
    avgWaiting: number
    avgTurnaround: number
  }
  explanation: string
}

const problems: Problem[] = [
  {
    id: 1,
    title: "Basic FCFS Scheduling",
    algorithm: "FCFS",
    difficulty: "Easy",
    processes: [
      { id: "P1", arrival: 0, burst: 5 },
      { id: "P2", arrival: 1, burst: 3 },
      { id: "P3", arrival: 2, burst: 4 },
    ],
    question: "Calculate the completion time, turnaround time, and waiting time for each process using FCFS scheduling.",
    solution: {
      gantt: [
        { process: "P1", start: 0, end: 5 },
        { process: "P2", start: 5, end: 8 },
        { process: "P3", start: 8, end: 12 },
      ],
      results: [
        { id: "P1", completion: 5, turnaround: 5, waiting: 0 },
        { id: "P2", completion: 8, turnaround: 7, waiting: 4 },
        { id: "P3", completion: 12, turnaround: 10, waiting: 6 },
      ],
      avgWaiting: 3.33,
      avgTurnaround: 7.33,
    },
    explanation: "In FCFS, processes execute in arrival order. P1 arrives first and runs for 5 units. P2 waits 4 units (5-1), then runs. P3 waits 6 units (8-2), then runs."
  },
  {
    id: 2,
    title: "SJF Non-Preemptive",
    algorithm: "SJF Non-Preemptive",
    difficulty: "Easy",
    processes: [
      { id: "P1", arrival: 0, burst: 7 },
      { id: "P2", arrival: 2, burst: 4 },
      { id: "P3", arrival: 4, burst: 1 },
      { id: "P4", arrival: 5, burst: 4 },
    ],
    question: "Calculate scheduling using SJF Non-Preemptive. Which process runs after P1 completes?",
    solution: {
      gantt: [
        { process: "P1", start: 0, end: 7 },
        { process: "P3", start: 7, end: 8 },
        { process: "P2", start: 8, end: 12 },
        { process: "P4", start: 12, end: 16 },
      ],
      results: [
        { id: "P1", completion: 7, turnaround: 7, waiting: 0 },
        { id: "P2", completion: 12, turnaround: 10, waiting: 6 },
        { id: "P3", completion: 8, turnaround: 4, waiting: 3 },
        { id: "P4", completion: 16, turnaround: 11, waiting: 7 },
      ],
      avgWaiting: 4,
      avgTurnaround: 8,
    },
    explanation: "P1 starts first (only process at t=0). At t=7, P2, P3, P4 are waiting. P3 has shortest burst (1), so it runs next. Then P2 (burst 4), then P4."
  },
  {
    id: 3,
    title: "SJF Preemptive (SRTF)",
    algorithm: "SJF Preemptive",
    difficulty: "Medium",
    processes: [
      { id: "P1", arrival: 0, burst: 7 },
      { id: "P2", arrival: 2, burst: 4 },
      { id: "P3", arrival: 4, burst: 1 },
      { id: "P4", arrival: 5, burst: 4 },
    ],
    question: "Compute scheduling using SJF Preemptive (SRTF). When does preemption occur?",
    solution: {
      gantt: [
        { process: "P1", start: 0, end: 2 },
        { process: "P2", start: 2, end: 4 },
        { process: "P3", start: 4, end: 5 },
        { process: "P2", start: 5, end: 7 },
        { process: "P4", start: 7, end: 11 },
        { process: "P1", start: 11, end: 16 },
      ],
      results: [
        { id: "P1", completion: 16, turnaround: 16, waiting: 9 },
        { id: "P2", completion: 7, turnaround: 5, waiting: 1 },
        { id: "P3", completion: 5, turnaround: 1, waiting: 0 },
        { id: "P4", completion: 11, turnaround: 6, waiting: 2 },
      ],
      avgWaiting: 3,
      avgTurnaround: 7,
    },
    explanation: "At t=2, P2 (burst 4) preempts P1 (remaining 5). At t=4, P3 (burst 1) preempts P2 (remaining 2). P3 completes, then P2, P4, finally P1."
  },
  {
    id: 4,
    title: "Round Robin Scheduling",
    algorithm: "Round Robin (TQ=2)",
    difficulty: "Medium",
    processes: [
      { id: "P1", arrival: 0, burst: 5 },
      { id: "P2", arrival: 1, burst: 4 },
      { id: "P3", arrival: 2, burst: 2 },
      { id: "P4", arrival: 3, burst: 1 },
    ],
    question: "Calculate Round Robin scheduling with time quantum = 2. Show the order of execution.",
    solution: {
      gantt: [
        { process: "P1", start: 0, end: 2 },
        { process: "P2", start: 2, end: 4 },
        { process: "P3", start: 4, end: 6 },
        { process: "P4", start: 6, end: 7 },
        { process: "P1", start: 7, end: 9 },
        { process: "P2", start: 9, end: 11 },
        { process: "P1", start: 11, end: 12 },
      ],
      results: [
        { id: "P1", completion: 12, turnaround: 12, waiting: 7 },
        { id: "P2", completion: 11, turnaround: 10, waiting: 6 },
        { id: "P3", completion: 6, turnaround: 4, waiting: 2 },
        { id: "P4", completion: 7, turnaround: 4, waiting: 3 },
      ],
      avgWaiting: 4.5,
      avgTurnaround: 7.5,
    },
    explanation: "Each process gets 2 time units. P1 runs 0-2, P2 runs 2-4, P3 completes at 6, P4 completes at 7, then P1 and P2 continue in round-robin fashion."
  },
  {
    id: 5,
    title: "Priority Non-Preemptive",
    algorithm: "Priority Non-Preemptive",
    difficulty: "Medium",
    processes: [
      { id: "P1", arrival: 0, burst: 4, priority: 2 },
      { id: "P2", arrival: 1, burst: 3, priority: 3 },
      { id: "P3", arrival: 2, burst: 1, priority: 1 },
      { id: "P4", arrival: 3, burst: 5, priority: 4 },
    ],
    question: "Calculate Priority Non-Preemptive scheduling. Lower number = higher priority.",
    solution: {
      gantt: [
        { process: "P1", start: 0, end: 4 },
        { process: "P3", start: 4, end: 5 },
        { process: "P2", start: 5, end: 8 },
        { process: "P4", start: 8, end: 13 },
      ],
      results: [
        { id: "P1", completion: 4, turnaround: 4, waiting: 0 },
        { id: "P2", completion: 8, turnaround: 7, waiting: 4 },
        { id: "P3", completion: 5, turnaround: 3, waiting: 2 },
        { id: "P4", completion: 13, turnaround: 10, waiting: 5 },
      ],
      avgWaiting: 2.75,
      avgTurnaround: 6,
    },
    explanation: "P1 runs first (only process at t=0). At t=4, P3 has highest priority (1), then P2 (3), then P4 (4)."
  },
  {
    id: 6,
    title: "Priority Preemptive",
    algorithm: "Priority Preemptive",
    difficulty: "Hard",
    processes: [
      { id: "P1", arrival: 0, burst: 4, priority: 2 },
      { id: "P2", arrival: 1, burst: 3, priority: 3 },
      { id: "P3", arrival: 2, burst: 1, priority: 1 },
      { id: "P4", arrival: 3, burst: 5, priority: 4 },
    ],
    question: "Calculate Priority Preemptive scheduling. When does preemption happen?",
    solution: {
      gantt: [
        { process: "P1", start: 0, end: 2 },
        { process: "P3", start: 2, end: 3 },
        { process: "P1", start: 3, end: 5 },
        { process: "P2", start: 5, end: 8 },
        { process: "P4", start: 8, end: 13 },
      ],
      results: [
        { id: "P1", completion: 5, turnaround: 5, waiting: 1 },
        { id: "P2", completion: 8, turnaround: 7, waiting: 4 },
        { id: "P3", completion: 3, turnaround: 1, waiting: 0 },
        { id: "P4", completion: 13, turnaround: 10, waiting: 5 },
      ],
      avgWaiting: 2.5,
      avgTurnaround: 5.75,
    },
    explanation: "At t=2, P3 (priority 1) arrives and preempts P1 (priority 2). After P3 completes, P1 resumes as it has higher priority than P2."
  },
]

const processColors: Record<string, string> = {
  P1: "bg-blue-500",
  P2: "bg-emerald-500",
  P3: "bg-amber-500",
  P4: "bg-rose-500",
  P5: "bg-violet-500",
}

const difficultyColors = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
}

export function PracticePage() {
  const [visibleSolutions, setVisibleSolutions] = useState<Set<number>>(new Set())
  const [visibleGantt, setVisibleGantt] = useState<Set<number>>(new Set())
  const [visibleTimes, setVisibleTimes] = useState<Set<number>>(new Set())

  const toggleSolution = (id: number) => {
    const newSet = new Set(visibleSolutions)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setVisibleSolutions(newSet)
  }

  const toggleGantt = (id: number) => {
    const newSet = new Set(visibleGantt)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setVisibleGantt(newSet)
  }

  const toggleTimes = (id: number) => {
    const newSet = new Set(visibleTimes)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setVisibleTimes(newSet)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Practice Problems</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your understanding of CPU scheduling algorithms with these practice exercises.
          </p>
        </div>

        <div className="space-y-8">
          {problems.map((problem) => {
            const totalTime = Math.max(...problem.solution.gantt.map(g => g.end))
            return (
              <Card key={problem.id} className="border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={difficultyColors[problem.difficulty]}>
                          {problem.difficulty}
                        </Badge>
                        <Badge variant="outline">{problem.algorithm}</Badge>
                      </div>
                      <CardTitle className="text-xl">Problem {problem.id}: {problem.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Process Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-4 font-medium text-sm">Process</th>
                          <th className="text-left py-2 px-4 font-medium text-sm">Arrival</th>
                          <th className="text-left py-2 px-4 font-medium text-sm">Burst</th>
                          {problem.processes[0].priority !== undefined && (
                            <th className="text-left py-2 px-4 font-medium text-sm">Priority</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {problem.processes.map((p) => (
                          <tr key={p.id} className="border-b border-border/50">
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${processColors[p.id]}`} />
                                <span className="font-medium">{p.id}</span>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-muted-foreground">{p.arrival}</td>
                            <td className="py-2 px-4 text-muted-foreground">{p.burst}</td>
                            {p.priority !== undefined && (
                              <td className="py-2 px-4 text-muted-foreground">{p.priority}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Question */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">{problem.question}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSolution(problem.id)}
                      className="gap-2"
                    >
                      {visibleSolutions.has(problem.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {visibleSolutions.has(problem.id) ? "Hide" : "Show"} Solution
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleGantt(problem.id)}
                      className="gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      {visibleGantt.has(problem.id) ? "Hide" : "Show"} Gantt Chart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTimes(problem.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {visibleTimes.has(problem.id) ? "Hide" : "Show"} Times
                    </Button>
                  </div>

                  {/* Gantt Chart */}
                  {visibleGantt.has(problem.id) && (
                    <div className="space-y-2 animate-in slide-in-from-top duration-300">
                      <p className="text-sm font-medium text-muted-foreground">Gantt Chart:</p>
                      <div className="flex h-12 rounded-lg overflow-hidden border border-border">
                        {problem.solution.gantt.map((block, idx) => {
                          const width = ((block.end - block.start) / totalTime) * 100
                          return (
                            <div
                              key={idx}
                              className={`${processColors[block.process]} flex items-center justify-center text-white text-sm font-medium`}
                              style={{ width: `${Math.max(width, 5)}%` }}
                            >
                              {width > 8 && block.process}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>{totalTime}</span>
                      </div>
                    </div>
                  )}

                  {/* Results Table */}
                  {visibleTimes.has(problem.id) && (
                    <div className="space-y-2 animate-in slide-in-from-top duration-300">
                      <p className="text-sm font-medium text-muted-foreground">Results:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-4 font-medium text-sm">Process</th>
                              <th className="text-left py-2 px-4 font-medium text-sm">Completion</th>
                              <th className="text-left py-2 px-4 font-medium text-sm">Turnaround</th>
                              <th className="text-left py-2 px-4 font-medium text-sm">Waiting</th>
                            </tr>
                          </thead>
                          <tbody>
                            {problem.solution.results.map((r) => (
                              <tr key={r.id} className="border-b border-border/50">
                                <td className="py-2 px-4 font-medium">{r.id}</td>
                                <td className="py-2 px-4 text-muted-foreground">{r.completion}</td>
                                <td className="py-2 px-4 text-muted-foreground">{r.turnaround}</td>
                                <td className="py-2 px-4 text-muted-foreground">{r.waiting}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-3 bg-primary/5 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Waiting Time</p>
                          <p className="font-bold text-primary">{problem.solution.avgWaiting.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Turnaround Time</p>
                          <p className="font-bold text-primary">{problem.solution.avgTurnaround.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Solution Explanation */}
                  {visibleSolutions.has(problem.id) && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg animate-in slide-in-from-top duration-300">
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{problem.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
