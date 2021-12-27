export default function FuelReport({ events }) {
  return (
    <>
      <h2>Fuel</h2>
      <div>{events.length} fuel events were found!</div>
      <div>
        {events.map((event, index) => (
          <FuelEvent key={index} event={event} />
        ))}
      </div>
    </>
  );
}

function FuelEvent({ event }) {
  const date = new Date(event.timeUtc);
  return (
    <div>
      <div>
        {date.toLocaleString()} recorded ${event.price.toFixed(2)} for{" "}
        {(event.currentTank - event.previousTank).toFixed(2)} L
      </div>
    </div>
  );
}
