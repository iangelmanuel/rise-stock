import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { getAllUserMovements } from "@/actions/stock/get-all-user-movements"
import { MovementsList } from "./movements-list"

export async function MovementsDrawer() {
  const movements = await getAllUserMovements()
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <ClipboardList className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto px-10 py-5">
        <DrawerHeader>
          <DrawerTitle>User Movements</DrawerTitle>
          <DrawerDescription>
            The last of our history is the most important. It is the one that
            will be used to make decisions in the future.
          </DrawerDescription>
        </DrawerHeader>

        <MovementsList movements={movements} />
      </DrawerContent>
    </Drawer>
  )
}
