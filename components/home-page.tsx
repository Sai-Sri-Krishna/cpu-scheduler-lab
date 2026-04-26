"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Clock, 
  Zap, 
  BarChart3, 
  Timer, 
  Calculator, 
  Play, 
  BookOpen, 
  Layers, 
  ArrowRight,
  Cpu,
  LineChart,
  Target
} from "lucide-react"
import type { PageType } from "@/app/page"

interface HomePageProps {
  setCurrentPage: (page: PageType) => void
}

const algorithms = [
  {
    title: "FCFS",
    fullName: "First Come First Serve",
    description: "Processes are executed in the order they arrive. Simple but can cause the convoy effect.",
    icon: Clock,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "SJF",
    fullName: "Shortest Job First",
    description: "Executes the process with the shortest burst time first. Minimizes average waiting time.",
    icon: Zap,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Round Robin",
    fullName: "Time-Sliced Scheduling",
    description: "Each process gets a fixed time quantum. Fair distribution of CPU time.",
    icon: Timer,
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "Priority",
    fullName: "Priority Scheduling",
    description: "Processes are executed based on priority. Higher priority processes run first.",
    icon: BarChart3,
    color: "from-rose-500 to-rose-600",
  },
]

const features = [
  {
    title: "Interactive Calculator",
    description: "Input process data and calculate scheduling metrics instantly with visual Gantt charts.",
    icon: Calculator,
  },
  {
    title: "Step-by-Step Visualization",
    description: "Watch algorithms execute step by step with detailed execution logs and queue states.",
    icon: Play,
  },
  {
    title: "Algorithm Comparison",
    description: "Compare multiple algorithms side-by-side using the same process data.",
    icon: Layers,
  },
  {
    title: "Practice Problems",
    description: "Test your understanding with exercises and detailed solutions.",
    icon: BookOpen,
  },
  {
    title: "Gantt Chart Generator",
    description: "Generate interactive, color-coded Gantt charts for any scheduling scenario.",
    icon: LineChart,
  },
  {
    title: "Complexity Analysis",
    description: "Understand time complexity, starvation risks, and algorithm trade-offs.",
    icon: Target,
  },
]

export function HomePage({ setCurrentPage }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/cpu-scheduler-lab/images/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Cpu className="w-4 h-4" />
              Operating Systems Education
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight text-balance">
              Master CPU Scheduling{" "}
              <span className="text-primary">Algorithms</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Learn how operating systems schedule processes using interactive calculators, 
              simulations, and visual timelines. From theory to practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="gap-2 text-base h-12 px-8"
                onClick={() => setCurrentPage("learn")}
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 text-base h-12 px-8"
                onClick={() => setCurrentPage("calculator")}
              >
                <Calculator className="w-4 h-4" />
                Open Calculator
              </Button>
            </div>
          </div>
          {/* Hero Image */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-3xl" />
              <img 
                src="/cpu-scheduler-lab/images/cpu-chip.jpg" 
                alt="CPU Processor Visualization"
                className="relative rounded-3xl shadow-2xl border border-white/10 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Wait Time</p>
                    <p className="font-semibold text-foreground">Optimized</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">6 Algorithms</p>
                    <p className="font-semibold text-foreground">Interactive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Algorithm Cards Section */}
      <section className="relative py-20 bg-muted/30 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/cpu-scheduler-lab/images/process-queue.jpg')" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Scheduling Algorithms
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the fundamental CPU scheduling algorithms used in modern operating systems.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithms.map((algo) => (
              <Card 
                key={algo.title} 
                className="group hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-primary/5 active:scale-[0.98] transition-all duration-300 cursor-pointer border-border/50 bg-card hover:border-primary/50"
                onClick={() => setCurrentPage("learn")}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${algo.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <algo.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{algo.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    {algo.fullName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {algo.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Feature Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Interactive Learning Tools
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Everything you need to understand and master CPU scheduling concepts.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Visual Gantt Charts</span>
             <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">Step-by-Step Mode</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">Real-time Calculations</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border/50 bg-card hover:bg-muted/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/cpu-scheduler-lab/images/simulator-visual.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Master CPU Scheduling?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Start with interactive examples and build your understanding step by step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="gap-2"
              onClick={() => setCurrentPage("simulator")}
            >
              <Play className="w-4 h-4" />
              Try the Simulator
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => setCurrentPage("practice")}
            >
              Practice Problems
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CPU Scheduler Lab</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              An interactive educational platform for learning CPU scheduling algorithms.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
