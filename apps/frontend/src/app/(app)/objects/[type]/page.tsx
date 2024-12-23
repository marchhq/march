interface Props {
  params: {
    type: string
  }
}

export default async function ObjectPage({ params }: Props) {
  const { type } = params

  return <div>{type} view</div>
}
