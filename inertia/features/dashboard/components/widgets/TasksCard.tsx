import { useState } from 'react'
import { useTasks } from '~/shared/hooks/use_tasks'
import { DateRangePicker } from '~/shared/ui/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/primitives/Card'
import { TaskItem } from './TaskItem'

export function TasksCard() {
  const { displayTasks, dateRange, setDateRange, toggleTask } = useTasks()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleToggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between mb-4">
        <CardTitle>Suas tarefas</CardTitle>
        <DateRangePicker
          dateRange={dateRange}
          isOpen={showDatePicker}
          onDateRangeChange={setDateRange}
          onToggle={handleToggleDatePicker}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTasks.map((task) => (
          <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
        ))}
      </CardContent>
    </Card>
  )
}
