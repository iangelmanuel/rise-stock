import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { badgeVariantSwitch } from "@/utils/badge-variant-switch"
import { formatDate } from "@/utils/format-date"
import type { User, UserMovement } from "@prisma/client"

interface MovementWithUser extends UserMovement {
  user: Pick<User, "name">
}

type Props = {
  movements: MovementWithUser[] | null
}

export function MovementsList({ movements }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted text-muted-foreground">
          <TableHead className="text-center font-bold">ID</TableHead>
          <TableHead className="text-center font-bold">User</TableHead>
          <TableHead className="text-center font-bold">
            Name of movement
          </TableHead>
          <TableHead className="text-center font-bold">Description</TableHead>
          <TableHead className="text-center font-bold">Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="max-h-[250px] overflow-y-auto">
        {movements ? (
          movements.map((move) => (
            <TableRow key={move.id}>
              <TableCell className="text-center">{move.id}</TableCell>
              <TableCell className="text-center">{move.user.name}</TableCell>
              <TableCell className="text-center">
                <Badge variant={badgeVariantSwitch(move.name)}>
                  {move.name}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{move.description}</TableCell>
              <TableCell className="text-center">
                {formatDate(move.createdAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-center font-medium">
              No movements yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
