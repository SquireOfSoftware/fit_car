export default function MileageReport({ events }) {
  return (
    <>
      <h2>Mileage</h2>
      <div>{events.length} mileage events were found!</div>
      <div>
        {events.map((event, index) => (
          <MileageEvent key={index} event={event} />
        ))}
      </div>
    </>
  );
}

function MileageEvent({ event }) {
  const date = new Date(event.timeUtc);
  return (
    <div>
      <div>
        {date.toLocaleString()} recorded {event.mileage} kms
      </div>
    </div>
  );
}
