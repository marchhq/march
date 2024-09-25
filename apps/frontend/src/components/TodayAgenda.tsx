export const TodayAgenda = (): JSX.Element => {
  const agendaItems = [
    {
      title: "15 Min-onboarding call with @oliursahin",
      time: "10:30 - 10:45PM 15 min",
      startTime: "18:00",
    },
    {
      title: "15 Min-onboarding call with @oliursahin",
      time: "10:30 - 10:45PM 15 min",
      startTime: "22:00",
    },
  ]

  return (
    <ol className="relative border-s border-gray-color">
      <h1 className="mb-6 ml-6 text-lg text-white">Upcoming in 30mins</h1>
      {agendaItems.map((item, index) => (
        <li key={index} className="mb-16 ms-6 text-gray-color">
          <h1 className="mb-1 flex items-center text-lg font-medium">
            {item.title}
          </h1>
          <time className="mb-2 block text-sm">{item.time}</time>

          <span className="absolute -start-5 flex size-16 items-center justify-start rounded-full bg-background text-white">
            {item.startTime}
          </span>
        </li>
      ))}
    </ol>
  )
}
