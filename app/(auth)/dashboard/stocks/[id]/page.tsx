import { getClothesCollectionById } from "@/actions/clothes/get-collection-by-id"
import { ClothesGrid } from "@/components/dashboard/stock/clothes-grid"

type Params = Promise<{ id: string }>

export default async function StockOfCollectionPage({
  params
}: {
  params: Params
}) {
  const { id } = await params

  const collection = await getClothesCollectionById(id)
  return (
    <>
      <section className="my-5">
        <h1 className="mb-3 text-4xl font-bold">{collection?.name}</h1>
        <p>
          This page is for viewing the details of {collection?.name} collection.
        </p>
      </section>

      <ClothesGrid collection={collection} />
    </>
  )
}
