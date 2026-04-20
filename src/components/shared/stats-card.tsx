import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

type Props = {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function StatsCard({ title, value, icon: Icon, description }: Props) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md hover:shadow-primary/8">
      <CardHeader>
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <CardAction>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
