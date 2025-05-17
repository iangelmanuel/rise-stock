import { getClothesCollectionById } from "@/actions/stock/get-collection-by-id"
import { ClothesGrid } from "@/components/dashboard/stock/clothes-grid"
import { CreateNewClothes } from "@/components/dashboard/stock/create-new-clothes"
import { redirect } from "next/navigation"

type Params = Promise<{ id: string }>

export default async function StockOfCollectionPage({
  params
}: {
  params: Params
}) {
  const { id } = await params

  const collection = await getClothesCollectionById(id)
  if (!collection) redirect("/dashboard/stocks")

  return (
    <>
      <section className="my-5 flex items-center justify-between">
        <div>
          <h1 className="mb-3 text-4xl font-bold">{collection?.name}</h1>
          <p>
            This page is for viewing the details of {collection?.name}{" "}
            collection.
          </p>
        </div>

        <CreateNewClothes collectionId={collection.id} />
      </section>

      <ClothesGrid collection={collection} />
    </>
  )
}
