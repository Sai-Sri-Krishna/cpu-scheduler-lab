"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, BookOpen, Code, Users, Target, Lightbulb } from "lucide-react"

export function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
            <Cpu className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">About CPU Scheduler Lab</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An interactive educational platform designed to help students master CPU scheduling algorithms
            through hands-on learning and visualization.
          </p>
        </div>

        {/* What is CPU Scheduling */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              What is CPU Scheduling?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              CPU scheduling is a fundamental concept in operating systems that determines which process 
              gets to use the CPU at any given time. When multiple processes are ready to execute, 
              the operating system must decide which one should run next.
            </p>
            <p>
              The scheduler makes this decision based on various algorithms, each with different 
              objectives such as maximizing CPU utilization, minimizing waiting time, ensuring 
              fairness, or meeting real-time deadlines.
            </p>
            <p>
              Understanding CPU scheduling is essential for anyone studying operating systems, 
              as it directly impacts system performance, responsiveness, and resource utilization.
            </p>
          </CardContent>
        </Card>

        {/* Why It Matters */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Why It Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">System Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Efficient scheduling maximizes CPU utilization and throughput, ensuring 
                  the system handles workloads effectively.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">User Experience</h4>
                <p className="text-sm text-muted-foreground">
                  Good scheduling algorithms minimize response time, making interactive 
                  applications feel responsive and smooth.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Resource Fairness</h4>
                <p className="text-sm text-muted-foreground">
                  Scheduling ensures all processes get fair access to CPU time, 
                  preventing starvation and resource monopolization.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Real-Time Systems</h4>
                <p className="text-sm text-muted-foreground">
                  Critical applications like medical devices and aviation systems 
                  require precise scheduling to meet strict deadlines.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Purpose */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Purpose of This Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              CPU Scheduler Lab was created to bridge the gap between theoretical knowledge 
              and practical understanding of scheduling algorithms. Traditional textbooks 
              explain concepts well, but students often struggle to visualize how algorithms 
              actually work with real data.
            </p>
            <p>
              This platform provides:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <span className="font-medium text-foreground">Interactive calculators</span> that 
                let you input your own process data and see immediate results
              </li>
              <li>
                <span className="font-medium text-foreground">Visual simulations</span> that 
                show algorithms executing step-by-step with animated queues
              </li>
              <li>
                <span className="font-medium text-foreground">Gantt chart generators</span> that 
                create visual timelines of process execution
              </li>
              <li>
                <span className="font-medium text-foreground">Comparison tools</span> that 
                help you understand trade-offs between different algorithms
              </li>
              <li>
                <span className="font-medium text-foreground">Practice problems</span> with 
                solutions to test and reinforce your understanding
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Who Is This For?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Computer Science Students</h4>
                  <p className="text-sm text-muted-foreground">
                    Students taking Operating Systems courses who need to understand and 
                    practice CPU scheduling algorithms for exams and assignments.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Code className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Software Engineers</h4>
                  <p className="text-sm text-muted-foreground">
                    Developers preparing for technical interviews or wanting to 
                    refresh their knowledge of fundamental OS concepts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Educators</h4>
                  <p className="text-sm text-muted-foreground">
                    Teachers and professors who want visual tools to demonstrate 
                    scheduling concepts in their lectures and labs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithms Covered */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Algorithms Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "FCFS", desc: "First Come First Serve" },
                { name: "SJF", desc: "Shortest Job First" },
                { name: "SRTF", desc: "Shortest Remaining Time" },
                { name: "Round Robin", desc: "Time-Sliced Scheduling" },
                { name: "Priority NP", desc: "Non-Preemptive Priority" },
                { name: "Priority P", desc: "Preemptive Priority" },
              ].map((algo) => (
                <div key={algo.name} className="p-4 rounded-lg border border-border bg-card">
                  <div className="font-medium text-foreground">{algo.name}</div>
                  <div className="text-sm text-muted-foreground">{algo.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Interactive process input tables",
                "Real-time Gantt chart generation",
                "Step-by-step execution mode",
                "Animated CPU simulation",
                "Algorithm comparison dashboard",
                "Practice problems with solutions",
                "Time complexity analysis",
                "Dark/Light mode support",
                "Responsive mobile design",
                "Export-ready visualizations",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Built for education. Learn, practice, and master CPU scheduling algorithms.
          </p>
        </div>
      </div>
    </div>
  )
}
