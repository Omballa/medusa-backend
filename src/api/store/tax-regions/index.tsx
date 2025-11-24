export async function getTaxRegion(taxRegionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/tax-regions/${taxRegionId}`
  )
  return res.json()
}
