import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type { User, UserMovement } from "@prisma/client"

interface MovementWithUser extends UserMovement {
  user: Pick<User, "name">
}

interface Props {
  movements: MovementWithUser[] | null
}

export const HistorialList = ({ movements }: Props) => {
  console.log(movements)

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
        </TableRow>
      </TableHeader>

      <TableBody className="overflow-y-auto max-h-[250px]">
        {movements ? (
          movements.map((move) => (
            <TableRow key={move.id}>
              <TableCell className="text-center">{move.id}</TableCell>
              <TableCell className="text-center">{move.user.name}</TableCell>
              <TableCell className="text-center">{move.name}</TableCell>
              <TableCell className="text-center">{move.description}</TableCell>
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
