interface PageHeaderProps {
  heading: string
  text?: string
}

export function PageHeader({ heading, text }: PageHeaderProps) {
  return (
    <div className="container px-6 py-8 mx-auto">
      <div className="flex flex-col pb-4 space-y-2">
        <h1 className="text-5xl font-black leading-tight">{heading}</h1>
        {text && <p className="text-2xl font-light text-gray-600">{text}</p>}
      </div>
    </div>
  )
}
