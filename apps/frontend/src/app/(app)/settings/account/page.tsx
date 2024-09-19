import { Heading } from "@/src/components/atoms/Heading"

const About = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-gray-color">
      <div className="w-full max-w-4xl">
        <div className="ml-4">
          <Heading label="Account" />
        </div>
        <div className="mt-8 rounded-md p-8 shadow-md">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex w-full flex-col items-start rounded-md bg-background-active p-6">
              <p className="mb-4 text-left text-lg font-medium">
                Profile Picture
              </p>
              <div className="mb-4 flex w-full justify-center">
                <img
                  src="https://via.placeholder.com/200"
                  alt="Profile"
                  className="size-48 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="w-full max-w-[800px] space-y-2">
              <div className="flex justify-between">
                <p className="text-lg font-medium">Email</p>
                <p className="flex h-10 w-56 items-center rounded-md bg-background-active px-3 py-2 text-left text-sm shadow-md">
                  user@example.com
                </p>
              </div>
              <div className="flex justify-between pt-8">
                <p className="text-lg font-medium">Full name</p>
                <p className="flex h-10 w-56 items-center rounded-md bg-background-active px-3 py-2 text-left text-sm shadow-md">
                  Oliur Sahin
                </p>
              </div>
              <div className="flex justify-between pt-8">
                <p className="flex flex-col space-y-1 text-lg font-medium">
                  Username
                  <span className="text-xs text-zinc-700">
                    Nickname or first name, however you want to be called in
                    march
                  </span>
                </p>
                <p className="flex h-10 w-56 items-center rounded-md bg-background-active px-3 py-2 text-left text-sm shadow-md">
                  sahin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
