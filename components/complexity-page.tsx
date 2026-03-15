"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

const algorithms = [
  {
    name: "FCFS",
    fullName: "First Come First Serve",
    preemptive: false,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    avgWaitingBehavior: "Can be high",
    starvation: false,
    contextSwitches: "Minimal",
    description: "Simple queue-based scheduling. Time complexity is O(n) for processing n processes in arrival order. No sorting required.",
    pros: ["Simple implementation", "No starvation", "Predictable behavior"],
    cons: ["Convoy effect", "High waiting time for short jobs"],
  },
  {
    name: "SJF Non-Preemptive",
    fullName: "Shortest Job First (Non-Preemptive)",
    preemptive: false,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    avgWaitingBehavior: "Optimal (theoretically)",
    starvation: true,
    contextSwitches: "Minimal",
    description: "Requires sorting processes by burst time at each scheduling decision. O(n²) due to repeated selection of minimum burst time process.",
    pros: ["Minimum average waiting time", "Optimal for batch systems"],
    cons: ["Starvation possible", "Requires burst time prediction"],
  },
  {
    name: "SJF Preemptive (SRTF)",
    fullName: "Shortest Remaining Time First",
    preemptive: true,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    avgWaitingBehavior: "Optimal",
    starvation: true,
    contextSwitches: "High",
    description: "Continuously compares remaining times. Each time unit may require comparison with all processes, leading to O(n²) complexity.",
    pros: ["Truly optimal waiting time", "Good response time"],
    cons: ["High context switch overhead", "Severe starvation risk"],
  },
  {
    name: "Round Robin",
    fullName: "Round Robin Scheduling",
    preemptive: true,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    avgWaitingBehavior: "Moderate",
    starvation: false,
    contextSwitches: "Quantum dependent",
    description: "Simple circular queue traversal. Each process is served for at most quantum time. Overall complexity is O(n) per round.",
    pros: ["Fair CPU distribution", "No starvation", "Good for interactive systems"],
    cons: ["Quantum tuning critical", "More context switches"],
  },
  {
    name: "Priority Non-Preemptive",
    fullName: "Priority Scheduling (Non-Preemptive)",
    preemptive: false,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    avgWaitingBehavior: "Variable",
    starvation: true,
    contextSwitches: "Minimal",
    description: "Similar to SJF but sorts by priority. Requires finding maximum/minimum priority at each decision point.",
    pros: ["Important tasks first", "Flexible priority assignment"],
    cons: ["Starvation for low priority", "Priority inversion possible"],
  },
  {
    name: "Priority Preemptive",
    fullName: "Priority Scheduling (Preemptive)",
    preemptive: true,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    avgWaitingBehavior: "Variable",
    starvation: true,
    contextSwitches: "High",
    description: "Must check all processes at each time unit for potential preemption. Priority comparison at each step leads to O(n²).",
    pros: ["Critical tasks get immediate CPU", "Real-time capable"],
    cons: ["Highest starvation risk", "High overhead"],
  },
]

const insights = [
  {
    title: "Time Complexity Trade-off",
    description: "O(n) algorithms (FCFS, RR) are simpler but may have higher average waiting times. O(n²) algorithms (SJF, Priority) optimize waiting time but require more computation.",
    icon: Info,
    color: "text-blue-500",
  },
  {
    title: "Starvation Prevention",
    description: "Aging technique can be applied to SJF and Priority algorithms: gradually increase priority of waiting processes to prevent indefinite waiting.",
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  {
    title: "Context Switch Overhead",
    description: "Preemptive algorithms have higher context switch costs. Each switch requires saving/restoring process state, typically taking 1-1000 microseconds.",
    icon: Info,
    color: "text-blue-500",
  },
  {
    title: "Real-World Usage",
    description: "Modern OS use multilevel feedback queues combining multiple algorithms. Interactive processes get RR, CPU-bound get FCFS, real-time get priority.",
    icon: CheckCircle,
    color: "text-emerald-500",
  },
]

export function ComplexityPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Complexity Analysis</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare time complexity, space requirements, and behavioral characteristics of each scheduling algorithm.
          </p>
        </div>

        {/* Main Comparison Table */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Algorithm Properties Comparison</CardTitle>
            <CardDescription>Detailed comparison of all scheduling algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">Algorithm</th>
                    <th className="text-center py-3 px-4 font-medium whitespace-nowrap">Preemptive</th>
                    <th className="text-center py-3 px-4 font-medium whitespace-nowrap">Time</th>
                    <th className="text-center py-3 px-4 font-medium whitespace-nowrap">Space</th>
                    <th className="text-center py-3 px-4 font-medium whitespace-nowrap">Avg Wait</th>
                    <th className="text-center py-3 px-4 font-medium whitespace-nowrap">Starvation</th>
                    <th className="text-center py-3 px-4 font-medium whitespace-nowrap">Context Switches</th>
                  </tr>
                </thead>
                <tbody>
                  {algorithms.map((algo) => (
                    <tr key={algo.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{algo.name}</div>
                          <div className="text-xs text-muted-foreground">{algo.fullName}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {algo.preemptive ? (
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            No
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <code className="px-2 py-1 rounded bg-muted font-mono text-sm">
                          {algo.timeComplexity}
                        </code>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <code className="px-2 py-1 rounded bg-muted font-mono text-sm">
                          {algo.spaceComplexity}
                        </code>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                        {algo.avgWaitingBehavior}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {algo.starvation ? (
                          <div className="flex items-center justify-center gap-1 text-rose-500">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">Possible</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-emerald-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">No</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                        {algo.contextSwitches}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {algorithms.map((algo) => (
            <Card key={algo.name} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{algo.name}</CardTitle>
                  <code className="px-2 py-1 rounded bg-primary/10 text-primary font-mono text-sm">
                    {algo.timeComplexity}
                  </code>
                </div>
                <CardDescription>{algo.fullName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{algo.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Advantages
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {algo.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Disadvantages
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {algo.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 mt-1">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-lg bg-muted/30">
                  <div className={`flex-shrink-0 ${insight.color}`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complexity Formulas */}
        <Card className="border-border/50 mt-8">
          <CardHeader>
            <CardTitle>Understanding the Formulas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Turnaround Time (TAT)</h4>
                <p className="font-mono text-lg mb-2 text-primary">TAT = Completion Time - Arrival Time</p>
                <p className="text-sm text-muted-foreground">
                  Total time from process arrival to completion. Includes both waiting and execution time.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Waiting Time (WT)</h4>
                <p className="font-mono text-lg mb-2 text-primary">WT = Turnaround Time - Burst Time</p>
                <p className="text-sm text-muted-foreground">
                  Time spent waiting in the ready queue. Does not include execution time.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Response Time (RT)</h4>
                <p className="font-mono text-lg mb-2 text-primary">RT = First Execution - Arrival Time</p>
                <p className="text-sm text-muted-foreground">
                  Time from arrival until the process first gets CPU. Important for interactive systems.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">CPU Utilization</h4>
                <p className="font-mono text-lg mb-2 text-primary">Utilization = (Busy Time / Total Time) x 100%</p>
                <p className="text-sm text-muted-foreground">
                  Percentage of time CPU is actively executing processes. Higher is better.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
