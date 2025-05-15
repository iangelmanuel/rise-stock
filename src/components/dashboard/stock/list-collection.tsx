import { getAllCollection } from "@/actions/clothes/get-all-collection.action"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import Link from "next/link"
import { Fragment } from "react"

export const ListCollection = async () => {
  const collection = await getAllCollection()

  return (
    <section className="mt-10">
      <Table>
        <TableCaption>A list of Rise's collection</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center p-5 border-t">Name</TableHead>
            <TableHead className="text-center p-5 border-t">
              Number of clothes
            </TableHead>
            <TableHead className="text-center p-5 border-t">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            {collection && collection.length > 0 ? (
              collection.map((item) => (
                <Fragment key={item.id}>
                  <TableCell className="font-medium text-center">
                    {item.name}
                  </TableCell>

                  <TableCell className="font-medium text-center">
                    {item.clothes.length}
                  </TableCell>

                  <TableCell className="font-medium text-center">
                    <Link
                      href={`/dashboard/stocks/${item.id}`}
                      className="text-blue-300 hover:text-blue-500 hover:underline"
                    >
                      Go to the collection
                    </Link>
                  </TableCell>
                </Fragment>
              ))
            ) : (
              <TableCell
                colSpan={4}
                className="text-center"
              >
                No collection available
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </section>
  )
}
