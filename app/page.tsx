"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HomePage } from "@/components/home-page"
import { LearnPage } from "@/components/learn-page"
import { CalculatorPage } from "@/components/calculator-page"
import { SimulatorPage } from "@/components/simulator-page"
import { PracticePage } from "@/components/practice-page"
import { ComparisonPage } from "@/components/comparison-page"
import { ComplexityPage } from "@/components/complexity-page"
import { AboutPage } from "@/components/about-page"

export type PageType = "home" | "learn" | "calculator" | "simulator" | "practice" | "comparison" | "complexity" | "about"

export default function CPUSchedulerLab() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")


  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />
      case "learn":
        return <LearnPage />
      case "calculator":
        return <CalculatorPage />
      case "simulator":
        return <SimulatorPage />
      case "practice":
        return <PracticePage />
      case "comparison":
        return <ComparisonPage />
      case "complexity":
        return <ComplexityPage />
      case "about":
        return <AboutPage />
      default:
        return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  )
}
