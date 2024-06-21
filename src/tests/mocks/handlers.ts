import { db } from "./db"

export const handlers = [
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
  // http.get("/categories", () => {
  //   return HttpResponse.json([
  //     { id: 1, name: "Electronics" },
  //     { id: 2, name: "Beautity" },
  //     { id: 3, name: "Gardening" },
  //   ])
  // }),

  // http.get("/products", () => {
  //   return HttpResponse.json(products)
  // }),

  // http.get("/products/:id", ({ params }) => {
  //   const id = Number(params.id)

  //   const product = products.find((p) => id === p.id)

  //   if (!product) {
  //     return new HttpResponse(null, { status: 404 })
  //   }

  //   return HttpResponse.json(product)
  // }),
]
