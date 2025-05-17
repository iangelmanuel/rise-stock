import { ListCollection } from "@/components/dashboard/stock/list-collection"

export default function StocksPage() {
  return (
    <>
      <section className="my-5">
        <h1 className="mb-3 text-4xl font-bold">Stock</h1>
        <p>
          This is the stock page. You can view and manage your collections here.
        </p>
      </section>

      <ListCollection />
    </>
  )
}
