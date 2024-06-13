export default function AutoPartPage({ params }: { params: { id: number } }) {
  return (
    <div>
      <div className="container">{params.id}</div>
    </div>
  );
}
