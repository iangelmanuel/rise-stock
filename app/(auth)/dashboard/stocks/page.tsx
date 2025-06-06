import { getAllCollection } from "@/actions/stock/get-all-collection.action"
import { CreateNewCollection } from "@/components/dashboard/stock/create-new-collection"
import { ListCollection } from "@/components/dashboard/stock/list-collection"

export default async function StocksPage() {
  const collection = await getAllCollection()
  return (
    <>
      <section className="flex justify-between items-center my-5">
        <div>
          <h1 className="mb-3 text-4xl font-bold">Stock</h1>
          <p>
            This is the stock page. You can view and manage your collections
            here.
          </p>
        </div>

        <CreateNewCollection />
      </section>

      <ListCollection collection={collection} />
    </>
  )
}
