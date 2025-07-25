import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type { Clothes, Collection } from "@prisma/client"
import { DropdownCollectionActions } from "./dropdown-collection-action"

type CollectionWithClothes = {
  clothes: {
    id: Clothes["id"]
  }[]
} & Collection

type Props = {
  collection: CollectionWithClothes[]
}

export function ListCollection({ collection }: Props) {
  return (
    <section className="mt-10">
      <Table>
        <TableCaption>A list of Rise&apos;s collection</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="border-t p-5 text-center">Name</TableHead>
            <TableHead className="border-t p-5 text-center">
              Number of clothes
            </TableHead>
            <TableHead className="border-t p-5 text-center">
              Navigation
            </TableHead>
            <TableHead className="border-t p-5 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <CollectionRow collection={collection} />
        </TableBody>
      </Table>
    </section>
  )
}

function CollectionRow({ collection }: Props) {
  return collection && collection.length > 0 ? (
    collection.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="text-center font-medium">{item.name}</TableCell>

        <TableCell className="text-center font-medium">
          {item.clothes.length}
        </TableCell>

        <TableCell className="text-center font-medium">
          <Link
            href={`/dashboard/stocks/${item.id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            View Collection
          </Link>
        </TableCell>

        <TableCell className="text-center font-medium">
          <DropdownCollectionActions collectionData={item} />
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell
        colSpan={4}
        className="text-center"
      >
        No collection available
      </TableCell>
    </TableRow>
  )
}
