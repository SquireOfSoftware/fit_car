export default function MileageReadOut(props) {
  const date = new Date(props.timeUtc);
  return (
    <>
      <div>
        {date.getDate()}-{date.getMonth()}-{date.getFullYear()}
      </div>
      <div>{props.mileage}</div>
    </>
  );
}
