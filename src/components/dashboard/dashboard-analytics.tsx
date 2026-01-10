"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts"
import { Building2, BookOpen, Users, DoorOpen, GraduationCap, Layers } from "lucide-react"

interface Stats {
  counts: {
    departments: number
    subjects: number
    faculty: number
    rooms: number
    students: number
    batches: number
  }
  roomUtilization: { name: string; count: number }[]
  facultyLoad: { name: string; count: number }[]
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]

export function DashboardAnalytics() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="h-24" />
        </Card>
      ))}
    </div>
  }

  if (!stats) return null

  const countCards = [
    { title: "Departments", value: stats.counts.departments, icon: Building2, color: "text-violet-500" },
    { title: "Faculty", value: stats.counts.faculty, icon: Users, color: "text-emerald-500" },
    { title: "Students", value: stats.counts.students, icon: GraduationCap, color: "text-blue-500" },
    { title: "Batches", value: stats.counts.batches, icon: Layers, color: "text-orange-500" },
  ]

    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {countCards.map((card) => (
            <Card key={card.title} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{card.value}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active in system</p>
              </CardContent>
            </Card>
          ))}
        </div>
  
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Room Utilization</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Top 5 most used classrooms</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.roomUtilization}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.roomUtilization.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
  
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Faculty Workload</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Top 5 faculty by class count</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.facultyLoad}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.facultyLoad.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    )

}
