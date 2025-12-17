import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type FacultyWorkloadRow = {
  id: string
  faculty_name: string
  short_code: string
  weekly_hours: number
}

export function FacultyWorkloadSummary({ workload }: { workload: FacultyWorkloadRow[] }) {
  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-slate-50">Faculty workload summary</CardTitle>
      </CardHeader>
      <CardContent>
        {workload.length === 0 ? (
          <p className="text-sm text-slate-400">No scheduled classes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Faculty</TableHead>
                  <TableHead className="text-slate-300">Code</TableHead>
                  <TableHead className="text-right text-slate-300">Hours / week</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workload.map(row => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium text-slate-50">{row.faculty_name}</TableCell>
                    <TableCell className="text-slate-300">{row.short_code}</TableCell>
                    <TableCell className="text-right text-slate-50">{row.weekly_hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
