export default function Error() {
  return Response.json({ error: "Internal Server Error" }, { status: 500 });
}
