import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface MedicalRecordCardProps {
    title: string
    date: string | Date
    dateLabel?: string
    veterinarian?: string
    notes?: string | null
    nextDate?: string | Date | null
    nextDateLabel?: string
    onDelete: () => void
    children?: React.ReactNode
}

export function MedicalRecordCard({
    title,
    date,
    dateLabel = "",
    veterinarian,
    notes,
    nextDate,
    nextDateLabel = "Próxima",
    onDelete,
    children
}: MedicalRecordCardProps) {
    return (
        <Card className="bg-white dark:bg-[#081028]">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">{title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {dateLabel ? `${dateLabel} ` : ''}{formatDate(date)}
                        </p>
                        {veterinarian && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Veterinario: {veterinarian}
                            </p>
                        )}
                        {notes && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Notas: {notes}
                            </p>
                        )}
                        {children}
                    </div>
                    <div className="flex items-center space-x-2">
                        {nextDate && (
                            <Badge variant="outline" className="border-indigo-300 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300">
                                {nextDateLabel}: {formatDate(nextDate)}
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
